const VISITOR_KEY = 'otterly-visitor-id'

export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

export function clearVisitorId(): void {
  localStorage.removeItem(VISITOR_KEY)
}
