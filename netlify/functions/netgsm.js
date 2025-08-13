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
  
  // Terminal'de çalışan komut formatı (VARSILAN)
  const url = `http://crmsntrl.netgsm.com.tr:9111/8503092120/originate?username=8503092120&password=41%402BF7&customer_num=${formattedPhone}&pbxnum=8503092120&internal_num=1001&ring_timeout=20&crm_id=${call_id || 'test_real_call'}&wait_response=1&originate_order=of&trunk=8503092120`;
  
  console.log('Calling NetGSM with terminal command format:', url);
  
  try {
    const fetch = require('node-fetch');
    const response = await fetch(url, {
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
          url_used: url,
          password_type: 'terminal_working_format',
          terminal_command: `curl "${url}"`
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        url: url,
        terminal_command: `curl "${url}"`
      })
    };
  }
};
