// Add at the top
import { rateLimit } from '@/lib/rate-limit';

// Add before try/catch
const identifier = 'api/library';
const { success } = await rateLimit(identifier);

if (!success) {
  return NextResponse.json(
    { error: "Too many requests" },
    { status: 429 }
  );
}

// Add to successful response
return new NextResponse(JSON.stringify(formattedBooks), {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, s-maxage=60',
  },
});