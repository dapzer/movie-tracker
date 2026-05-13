import { eq, lt } from "drizzle-orm"
import { SessionData, Store } from "express-session"

interface DrizzleSessionStoreOptions {
  checkPeriod?: number
}

export class DrizzleSessionStore extends Store {
  private checkInterval?: NodeJS.Timeout

  constructor(
    private readonly db: any,
    private readonly sessionTable: any,
    private readonly options: DrizzleSessionStoreOptions = {},
  ) {
    super()

    this.startInterval()
  }

  async get(
    sid: string,
    callback: (err: unknown, session?: SessionData | null) => void,
  ) {
    try {
      const result = await this.db
        .select()
        .from(this.sessionTable)
        .where(eq(this.sessionTable.sid, sid))
        .limit(1)

      if (result.length > 0) {
        const [session] = result
        const expiresAt = new Date(session.expiresAt).valueOf()

        if (Number.isFinite(expiresAt) && Date.now() >= expiresAt) {
          await this.db
            .delete(this.sessionTable)
            .where(eq(this.sessionTable.sid, sid))
            .execute()

          callback(null, null)
          return
        }

        callback(null, JSON.parse(session.data) as SessionData)
      }
      else {
        callback(null, null)
      }
    }
    catch (err: unknown) {
      callback(err)
    }
  }

  async set(
    sid: string,
    session: SessionData,
    callback?: (err?: unknown) => void,
  ) {
    const {
      cookie: { maxAge },
    } = session

    const expiresAt = typeof maxAge === "number"
      ? new Date(Date.now() + maxAge)
      : new Date(Date.now())

    try {
      await this.db
        .insert(this.sessionTable)
        .values({ id: sid, sid, data: JSON.stringify(session), expiresAt })
        .onConflictDoUpdate({
          target: this.sessionTable.sid,
          set: {
            data: JSON.stringify(session),
            expiresAt,
          },
        })

      callback?.()
    }
    catch (err: unknown) {
      callback?.(err)
    }
  }

  async prune() {
    try {
      await this.db
        .delete(this.sessionTable)
        .where(lt(this.sessionTable.expiresAt, new Date()))
        .execute()
    }
    catch {}
  }

  startInterval() {
    if (this.checkInterval) {
      return
    }

    const { checkPeriod } = this.options

    if (typeof checkPeriod === "number" && checkPeriod > 0) {
      this.checkInterval = setInterval(() => {
        this.prune()
      }, Math.floor(checkPeriod))
    }
  }

  async destroy(sid: string, callback?: (err?: unknown) => void) {
    try {
      await this.db
        .delete(this.sessionTable)
        .where(eq(this.sessionTable.sid, sid))
        .execute()

      callback?.()
    }
    catch (err: unknown) {
      callback?.(err)
    }
  }
}
