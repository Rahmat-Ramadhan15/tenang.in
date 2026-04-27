const rateLimitMap = new Map();

export function rateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 60 * 1000;

  const user = rateLimitMap.get(ip) || { count: 0, time: now };

  if (now - user.time > windowMs) {
    rateLimitMap.set(ip, { count: 1, time: now });
    return true;
  }

  if (user.count >= 10) {
    return false;
  }

  user.count++;
  rateLimitMap.set(ip, user);
  return true;
}