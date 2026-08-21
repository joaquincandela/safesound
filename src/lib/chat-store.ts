import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type ChatSender = "visitor" | "admin";

export type ChatMessage = {
  id: string;
  sender: ChatSender;
  text: string;
  at: number;
  readByAdmin: boolean;
  readByVisitor: boolean;
};

export type Conversation = {
  visitorId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

export function normalizeVisitorId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 64) return null;
  return trimmed;
}

export function sanitizeName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, 60);
}

export function sanitizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, 1000);
}

function normalizeConversation(
  visitorId: string,
  raw: unknown
): Conversation | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

  const obj = raw as Partial<Conversation>;
  const messages = Array.isArray(obj.messages)
    ? obj.messages.filter(
        (message): message is ChatMessage =>
          Boolean(message) &&
          typeof message === "object" &&
          typeof (message as ChatMessage).id === "string" &&
          ((message as ChatMessage).sender === "visitor" ||
            (message as ChatMessage).sender === "admin")
      )
    : [];

  return {
    visitorId,
    name: typeof obj.name === "string" ? obj.name : "",
    createdAt: Number(obj.createdAt) || Date.now(),
    updatedAt: Number(obj.updatedAt) || Date.now(),
    messages,
  };
}

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const USE_REDIS = Boolean(REDIS_URL && REDIS_TOKEN);

const CONV_KEY_PREFIX = "safesound:chat:conv:";
const INDEX_KEY = "safesound:chat:index";
const CONV_TTL_SECONDS = 90 * 24 * 60 * 60;

async function redisCommand<T>(command: unknown[]): Promise<T> {
  const response = await fetch(REDIS_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  const data = (await response.json()) as { result?: T; error?: string };
  if (data.error) throw new Error(`Redis: ${data.error}`);
  return data.result as T;
}

async function redisPipeline(commands: unknown[][]): Promise<unknown[]> {
  const response = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });

  const data = (await response.json()) as Array<{
    result?: unknown;
    error?: string;
  }>;
  for (const entry of data) {
    if (entry.error) throw new Error(`Redis: ${entry.error}`);
  }
  return data.map((entry) => entry.result);
}

const APPEND_SCRIPT = `
local data = redis.call('GET', KEYS[1])
local conv
if data then
  conv = cjson.decode(data)
else
  conv = {name = '', createdAt = tonumber(ARGV[3]), messages = {}}
end
if ARGV[2] ~= '' then conv.name = ARGV[2] end
table.insert(conv.messages, cjson.decode(ARGV[1]))
conv.updatedAt = tonumber(ARGV[3])
redis.call('SET', KEYS[1], cjson.encode(conv))
redis.call('SADD', KEYS[2], ARGV[4])
redis.call('EXPIRE', KEYS[1], tonumber(ARGV[5]))
return 1
`;

const MARK_READ_SCRIPT = `
local data = redis.call('GET', KEYS[1])
if not data then return 0 end
local conv = cjson.decode(data)
for _, message in ipairs(conv.messages) do
  if message.sender == ARGV[1] then
    message[ARGV[2]] = true
  end
end
redis.call('SET', KEYS[1], cjson.encode(conv))
return 1
`;

async function redisGetOrCreateConversation(
  visitorId: string,
  name?: string
): Promise<Conversation> {
  const raw = await redisCommand<string | null>([
    "GET",
    CONV_KEY_PREFIX + visitorId,
  ]);
  const existing = normalizeConversation(visitorId, raw ? JSON.parse(raw) : null);

  if (existing) {
    if (name && existing.name !== name) {
      await redisCommand([
        "EVAL",
        `local conv = cjson.decode(redis.call('GET', KEYS[1]))
conv.name = ARGV[1]
redis.call('SET', KEYS[1], cjson.encode(conv))
return 1`,
        "1",
        CONV_KEY_PREFIX + visitorId,
        name,
      ]);
      existing.name = name;
    }
    return existing;
  }

  const conversation: Conversation = {
    visitorId,
    name: name ?? "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  };
  await redisCommand([
    "SET",
    CONV_KEY_PREFIX + visitorId,
    JSON.stringify(conversation),
    "EX",
    String(CONV_TTL_SECONDS),
  ]);
  await redisCommand(["SADD", INDEX_KEY, visitorId]);
  return conversation;
}

async function redisAppendMessage(
  visitorId: string,
  sender: ChatSender,
  text: string,
  name?: string
): Promise<Conversation> {
  const now = Date.now();
  const message: ChatMessage = {
    id: randomUUID(),
    sender,
    text,
    at: now,
    readByAdmin: sender === "admin",
    readByVisitor: sender === "visitor",
  };

  await redisCommand([
    "EVAL",
    APPEND_SCRIPT,
    "2",
    CONV_KEY_PREFIX + visitorId,
    INDEX_KEY,
    JSON.stringify(message),
    sender === "visitor" && name ? name : "",
    String(now),
    String(CONV_TTL_SECONDS),
  ]);

  return redisGetOrCreateConversation(visitorId);
}

async function redisMarkThreadRead(
  visitorId: string,
  sender: ChatSender,
  field: "readByAdmin" | "readByVisitor"
): Promise<void> {
  await redisCommand([
    "EVAL",
    MARK_READ_SCRIPT,
    "1",
    CONV_KEY_PREFIX + visitorId,
    sender,
    field,
  ]);
}

async function redisListConversations(): Promise<Conversation[]> {
  const visitorIds = await redisCommand<string[]>(["SMEMBERS", INDEX_KEY]);
  if (!visitorIds || visitorIds.length === 0) return [];

  const results = await redisPipeline(
    visitorIds.map((visitorId) => ["GET", CONV_KEY_PREFIX + visitorId])
  );

  const conversations: Conversation[] = [];
  const missingIds: string[] = [];

  visitorIds.forEach((visitorId, index) => {
    const raw = results[index];
    const conversation = normalizeConversation(
      visitorId,
      raw ? JSON.parse(raw as string) : null
    );
    if (conversation) {
      conversations.push(conversation);
    } else {
      missingIds.push(visitorId);
    }
  });

  if (missingIds.length > 0) {
    redisCommand(["SREM", INDEX_KEY, ...missingIds]).catch(() => undefined);
  }

  return conversations.sort((a, b) => b.updatedAt - a.updatedAt);
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "chat.json");

let writeQueue: Promise<unknown> = Promise.resolve();

async function fileReadDb(): Promise<Record<string, Conversation>> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as { conversations?: unknown };
    const entries = Object.entries(parsed.conversations ?? {});
    const conversations: Record<string, Conversation> = {};
    for (const [visitorId, value] of entries) {
      const conversation = normalizeConversation(visitorId, value);
      if (conversation) conversations[visitorId] = conversation;
    }
    return conversations;
  } catch {
    return {};
  }
}

function fileWriteDb(conversations: Record<string, Conversation>): Promise<void> {
  const next = writeQueue.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${DATA_FILE}.${randomUUID()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify({ conversations }, null, 2), "utf8");
    await fs.rename(tmp, DATA_FILE);
  });
  writeQueue = next.catch(() => undefined);
  return next;
}

async function fileGetOrCreateConversation(
  visitorId: string,
  name?: string
): Promise<Conversation> {
  const conversations = await fileReadDb();
  let conversation = conversations[visitorId];

  if (!conversation) {
    conversation = {
      visitorId,
      name: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    conversations[visitorId] = conversation;
  }

  if (name) conversation.name = name;

  await fileWriteDb(conversations);
  return conversation;
}

async function fileListConversations(): Promise<Conversation[]> {
  const conversations = await fileReadDb();
  return Object.values(conversations).sort((a, b) => b.updatedAt - a.updatedAt);
}

async function fileAppendMessage(
  visitorId: string,
  sender: ChatSender,
  text: string,
  name?: string
): Promise<Conversation> {
  const conversations = await fileReadDb();
  let conversation = conversations[visitorId];

  if (!conversation) {
    conversation = {
      visitorId,
      name: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    conversations[visitorId] = conversation;
  }

  if (sender === "visitor" && name) conversation.name = name;

  conversation.messages.push({
    id: randomUUID(),
    sender,
    text,
    at: Date.now(),
    readByAdmin: sender === "admin",
    readByVisitor: sender === "visitor",
  });
  conversation.updatedAt = Date.now();

  await fileWriteDb(conversations);
  return conversation;
}

async function fileMarkThreadRead(
  visitorId: string,
  sender: ChatSender,
  field: "readByAdmin" | "readByVisitor"
): Promise<void> {
  const conversations = await fileReadDb();
  const conversation = conversations[visitorId];
  if (!conversation) return;

  let changed = false;
  for (const message of conversation.messages) {
    if (message.sender === sender && !message[field]) {
      message[field] = true;
      changed = true;
    }
  }

  if (changed) await fileWriteDb(conversations);
}

export async function getOrCreateConversation(
  visitorId: string,
  name?: string
): Promise<Conversation> {
  return USE_REDIS
    ? redisGetOrCreateConversation(visitorId, name)
    : fileGetOrCreateConversation(visitorId, name);
}

export async function listConversations(): Promise<Conversation[]> {
  return USE_REDIS ? redisListConversations() : fileListConversations();
}

export async function appendMessage(
  visitorId: string,
  sender: ChatSender,
  text: string,
  name?: string
): Promise<Conversation> {
  return USE_REDIS
    ? redisAppendMessage(visitorId, sender, text, name)
    : fileAppendMessage(visitorId, sender, text, name);
}

export async function markThreadReadByAdmin(visitorId: string): Promise<void> {
  return USE_REDIS
    ? redisMarkThreadRead(visitorId, "visitor", "readByAdmin")
    : fileMarkThreadRead(visitorId, "visitor", "readByAdmin");
}

export async function markThreadReadByVisitor(
  visitorId: string
): Promise<void> {
  return USE_REDIS
    ? redisMarkThreadRead(visitorId, "admin", "readByVisitor")
    : fileMarkThreadRead(visitorId, "admin", "readByVisitor");
}
