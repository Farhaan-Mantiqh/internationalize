import {getRequestConfig} from 'next-intl/server';
import requestIp from '@supercharge/request-ip';

export default getRequestConfig(async ({request}) => {
  const ip = requestIp.getClientIp(request) ?? '';
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await response.json();

  const country = data?.country ?? 'Unknown';

  console.log(`Visitor IP: ${ip}, Country: ${country}`);

  // Logic for choosing locale based on country
  let locale = 'en'; // default to 'en'

  if (country === 'IN') {
    locale = 'hi'; // For India, load 'hi.json'
  } else if (country === 'US') {
    locale = 'en'; // For US, load 'en.json'
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
