import { serverTimestamp } from "firebase/firestore"

export const ConstTime = {//時限
  AllDay: { id: 0,text:"終日",timeRange:null },
  One: { id: 1,text: "1時限目",timeRange:["08:50","9:35"] },
  Two: { id: 2,text:"2時限目",timeRange:["09:40","10:25"] },
  Three: { id: 3 ,text:"3時限目",timeRange:["10:35","11:20"] },
  Four: { id: 4 ,text:"4時限目",timeRange:["11:25","12:10"] },
  Five: { id: 5 ,text:"5時限目" ,timeRange:["13:00","13:45"]},
  Six: { id: 6 ,text:"6時限目" ,timeRange:["13:50","14:35"]},
  Seven: { id: 7,text:"7時限目" ,timeRange:["14:45","15:30"]},
  Eight: { id: 8 ,text:"8時限目",timeRange:["15:35","16:20"] }
  //Custom:9
}

export class Event {
  name
  date
  time
  subject
  finalUpdate
  place
  memo
  editor

  constructor(name,//なまえ STR
              date,//日付 Dataフォーマット STR?
              time,//時限 ConstTime
              subject,//教科 手打ち
              place,//提出先 URLRegexいれてもいいかも
              memo,//メモ
              finalUpdate = serverTimestamp(),//最終更新 (サーバータイムスタンプでー）
              editor="",//最終更新者 UID
  ) {
    this.name = name
    this.date = date
    this.time = time
    this.subject = subject
    this.place = place
    this.memo = memo
    this.finalUpdate = finalUpdate
    this.editor = editor
  }

}

export const eventConverter = {
  toFirestore: (event) => {
    return {
      name: event.name,
      date: event.date,
      time: event.time,
      subject: event.subject,
      place: event.place,
      memo: event.memo,
      finalUpdate: event.finalUpdate,
      editor:event.editor
    }
  }, fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    return new Event(data.name,
      data.date,
      data.time,
      data.subject,
      data.place,
      data.memo,
      data.finalUpdate,data.editor)
  }
}
