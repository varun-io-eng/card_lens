import 'dotenv/config';

console.log('=== DEBUG INFO ===');
console.log('API Key found:', !!process.env.ANTHROPIC_API_KEY);
console.log('Key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 15));
console.log('Key length:', process.env.ANTHROPIC_API_KEY?.length);

// Test API call
console.log('\nTesting Anthropic API...');
try {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Say hello in one word' }],
    }),
  });

  const data = await response.json();
  console.log('API Response status:', response.status);
  console.log('API Response:', JSON.stringify(data, null, 2));
} catch (err) {
  console.error('API Error:', err.message);
}
