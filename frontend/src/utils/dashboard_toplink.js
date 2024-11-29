const workerTopNavigation = [
  { name: 'Your Profile', href: '/worker/profile', to: 'link' },
  { name: 'Sign out', to: 'button' }
]
const adminTopNavigation = [
  { name: 'Your Profile', href: '/admin/profile', to: 'link' },
  { name: 'Sign out', to: 'button' }
]

function GreetUserWithTime () {
  const today = new Date()
  const curHr = today.getHours()

  if (curHr < 12) {
    return 'Good Morning'
  } else if (curHr < 18) {
    return 'Good Afternoon'
  } else {
    return 'Good Evening'
  }
}
export { GreetUserWithTime, adminTopNavigation, workerTopNavigation }
