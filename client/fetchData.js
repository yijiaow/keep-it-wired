const fetchData = {
  getFeed() {
    return fetch('http://127.0.0.1:3000/feed')
      .then(res => res.json())
      .catch(err => err)
  },
  getNotes(user) {
    return fetch(`http://127.0.0.1:3000/note?user=${user.userId}`)
      .then(res => res.json())
      .catch(err => err)
  },
  deleteNote(id) {
    return fetch(`http://127.0.0.1:3000/note/delete/${id}`, {
      method: 'DELETE'
    }).catch(err => err)
  }
}

module.exports = fetchData
