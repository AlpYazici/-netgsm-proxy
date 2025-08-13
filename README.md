# NetGSM Proxy

NetGSM voice call proxy service using Netlify Functions.

## 🚀 Quick Start

1. **Deploy to Netlify:**
   - Connect this repository to Netlify
   - Deploy automatically

2. **Function URL:**
   ```
   https://your-app.netlify.app/.netlify/functions/netgsm
   ```

3. **Usage:**
   ```javascript
   // GET request
   fetch('https://your-app.netlify.app/.netlify/functions/netgsm?phone=+905XXXXXXXXX&call_id=call_123')
   ```

## 📞 Parameters

- `phone` - Phone number (required)
- `call_id` - Call ID (optional, defaults to 'test')

## 🔧 Configuration

NetGSM credentials are hardcoded in the function:
- Username: `8503092120`
- Password: `41@2BF7`
- PBX Number: `8503092120`
- Internal Number: `1001`

## 📁 Structure

```
netgsm-proxy/
├── netlify/
│   └── functions/
│       └── netgsm.js
├── package.json
└── README.md
```

## 🚀 Deployment

1. Push to GitHub
2. Connect to Netlify
3. Deploy automatically
4. Use the function URL in your frontend
