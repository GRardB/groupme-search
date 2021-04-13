import axios from 'axios'
import PouchDB from 'pouchdb-browser'
import PouchDBFind from 'pouchdb-find'

const BASE_URL = 'https://api.groupme.com/v3'

PouchDB.plugin(PouchDBFind)

export const MAX_MESSAGE_LIMIT = 100

export class GroupMe {
  constructor(accessToken) {
    this.axios = axios.create({
      baseURL: BASE_URL,
      timeout: 1000,
      params: {
        token: accessToken,
      },
    })
  }

  getGroups() {
    return this.axios
      .get('/groups', {
        params: {
          omit: 'memberships',
        },
      })
      .then(({ data }) => data.response)
  }

  getGroup(groupId) {
    return this.axios
      .get(`/groups/${groupId}`, {
        omit: 'memberships',
      })
      .then(({ data }) => data.response)
  }

  async getGroupMessages(groupId) {
    const db = new PouchDB(`group_messages-${groupId}`)
    const queryOptions = {
      include_docs: true,
    }

    let messages = await db.allDocs(queryOptions)

    return messages.rows.map(({ doc }) => doc)
  }

  getGroupMessage(groupId, messageId) {
    const db = new PouchDB(`group_messages-${groupId}`)

    return db.get(messageId)
  }

  getGroupMessagesCount(groupId) {
    return this.getGroupMessagesBefore(groupId).then(({ count }) => count)
  }

  getGroupStoredMessagesCount(groupId) {
    const db = new PouchDB(`group_messages-${groupId}`)
    window.db = db
    window.lodash = require('lodash')

    return db.info().then(({ doc_count }) => doc_count)
  }

  getMe() {
    return this.axios.get('/users/me')
  }

  backfillGroupMessages(groupId, earliestStoredMessageId) {
    const db = new PouchDB(`group_messages-${groupId}`)

    return this.getGroupMessagesBefore(groupId, earliestStoredMessageId)
      .then(({ messages }) => {
        messages.forEach((m) => (m._id = m.id))
        return messages
      })
      .then((messages) => {
        return db.bulkDocs(messages).then(() => messages)
      })
  }

  getGroupMessagesBefore(groupId, beforeId) {
    const params = {
      limit: MAX_MESSAGE_LIMIT,
    }

    if (beforeId) {
      params.before_id = beforeId
    }

    return this.axios
      .get(`/groups/${groupId}/messages`, { params })
      .then(({ data }) => data.response)
  }
}

