import packageJson from '../../package.json';

export function memberCapacityForPlan(plan) {
  const spaces = packageJson?.planLimits?.[plan] || { 'Small Plan': 10, 'Medium Plan': 20, 'Large Plan': 30 }[plan] || 0;
  const totalUsers = packageJson?.planTotalUsers?.[plan] || { 'Small Plan': 250, 'Medium Plan': 500, 'Large Plan': 750 }[plan] || 0;
  return spaces > 0 ? Math.floor(totalUsers / spaces) : 0;
}
