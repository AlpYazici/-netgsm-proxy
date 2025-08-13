exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // Parametreleri al
  const { phone, call_id } = event.queryStringParameters || {};
  
  if (!phone) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Phone number required' })
    };
  }
  
  // Telefon formatla
  const formattedPhone = phone.replace('+90', '0').replace(/\s/g, '');
  
  // NetGSM URL
  const url = `http://crmsntrl.netgsm.com.tr:9111/8503092120/originate?username=8503092120&password=41@2BF7&customer_num=${formattedPhone}&pbxnum=8503092120&internal_num=1001&ring_timeout=20&crm_id=${call_id || 'test'}&wait_response=1&originate_order=of&trunk=8503092120`;
  
  console.log('Calling NetGSM:', url);
  
  try {
    const fetch = require('node-fetch');
    const response = await fetch(url);
    const data = await response.text();
    
    // JSON'a çevirmeyi dene
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = { raw: data };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(jsonData)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        url: url 
      })
    };
  }
};
