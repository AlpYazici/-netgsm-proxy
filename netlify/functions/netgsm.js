exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  const { phone, call_id, test_password } = event.queryStringParameters || {};
  
  if (!phone) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Phone number required' })
    };
  }
  
  const formattedPhone = phone.replace('+90', '0').replace(/\s/g, '');
  
  // 3 farklı password formatı dene
  let urls = [];
  
  if (test_password === '1') {
    // Password: 41%402BF7 (URL encoded)
    urls.push(`http://crmsntrl.netgsm.com.tr:9111/8503092120/originate?username=8503092120&password=41%402BF7&customer_num=${formattedPhone}&pbxnum=8503092120&internal_num=1001&ring_timeout=20&crm_id=${call_id || 'test'}&wait_response=1&originate_order=of&trunk=8503092120`);
  } else if (test_password === '2') {
    // Password: 41@2BF7 (direkt)
    urls.push(`http://crmsntrl.netgsm.com.tr:9111/8503092120/originate?username=8503092120&password=41@2BF7&customer_num=${formattedPhone}&pbxnum=8503092120&internal_num=1001&ring_timeout=20&crm_id=${call_id || 'test'}&wait_response=1&originate_order=of&trunk=8503092120`);
  } else if (test_password === '3') {
    // Ana hesap şifresi: 2AA25_B
    urls.push(`http://crmsntrl.netgsm.com.tr:9111/8503092120/originate?username=8503092120&password=2AA25_B&customer_num=${formattedPhone}&pbxnum=8503092120&internal_num=1001&ring_timeout=20&crm_id=${call_id || 'test'}&wait_response=1&originate_order=of&trunk=8503092120`);
  } else {
    // Terminal'de çalışan format
    urls.push(`http://crmsntrl.netgsm.com.tr:9111/8503092120/originate?username=8503092120&password=41%402BF7&customer_num=${formattedPhone}&pbxnum=8503092120&internal_num=1001&ring_timeout=20&crm_id=${call_id || 'test'}&wait_response=1&originate_order=of&trunk=8503092120`);
  }
  
  console.log('Trying URL:', urls[0]);
  
  try {
    const fetch = require('node-fetch');
    const response = await fetch(urls[0], {
      method: 'GET',
      headers: {
        'User-Agent': 'curl/7.64.1',
        'Accept': '*/*'
      }
    });
    
    const data = await response.text();
    
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = { raw: data };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...jsonData,
        debug: {
          url_used: urls[0],
          password_type: test_password || 'default'
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        url: urls[0]
      })
    };
  }
};
