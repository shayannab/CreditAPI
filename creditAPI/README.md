# FinPilot Credit Predictor API

A production-ready RESTful API for predicting credit scores based on financial data using a simple ML model. Built with Node.js and Express.

## Features

- Credit score prediction endpoint
- API key authentication middleware
- Request logging
- Input validation
- Modular, clean architecture
- Production-ready error handling
- CORS enabled

## Project Structure

```
finpilot-credit-api/
├── package.json
├── .env
├── README.md
├── src/
│   ├── index.js                    # Main server
│   ├── routes/
│   │   └── creditRoutes.js         # Credit API routes
│   ├── controllers/
│   │   └── creditController.js     # Request handlers
│   ├── middleware/
│   │   ├── auth.js                 # API key authentication
│   │   └── logger.js               # Request logging
│   └── utils/
│       └── mlModel.js              # ML prediction logic
```

## Installation

### Local Setup

1. Clone or download the project
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env`:

```env
PORT=3000
API_KEY=finpilot_api_key_2024_secure
NODE_ENV=development
```

4. Start the server:

```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-12T10:30:00.000Z"
}
```

### Predict Credit Score

```
POST /credit/predict
```

Headers:
```
Content-Type: application/json
x-api-key: finpilot_api_key_2024_secure
```

Request Body:
```json
{
  "income": 75000,
  "avg_balance": 5000,
  "on_time_payments": 24,
  "late_payments": 1
}
```

Response:
```json
{
  "predicted_score": 510,
  "breakdown": {
    "income_contrib": 75,
    "balance_contrib": 10,
    "on_time_contrib": 120,
    "late_penalty": 15
  },
  "advice": "Keep paying on time to maintain growth."
}
```

## Testing with cURL

### Basic Prediction

```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": 75000,
    "avg_balance": 5000,
    "on_time_payments": 24,
    "late_payments": 1
  }'
```

### High Credit Score Example

```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": 120000,
    "avg_balance": 15000,
    "on_time_payments": 48,
    "late_payments": 0
  }'
```

### Low Credit Score Example (Many Late Payments)

```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": 35000,
    "avg_balance": 1000,
    "on_time_payments": 5,
    "late_payments": 8
  }'
```

## Testing with Postman

1. Create a new POST request to `http://localhost:3000/credit/predict`
2. Add headers:
   - `Content-Type`: `application/json`
   - `x-api-key`: `finpilot_api_key_2024_secure`
3. Set body to raw JSON and paste:

```json
{
  "income": 75000,
  "avg_balance": 5000,
  "on_time_payments": 24,
  "late_payments": 1
}
```

4. Click Send

## ML Model Formula

The credit score prediction uses this formula:

```
predicted_score = 300 + (income/1000) + (avg_balance/500) + (on_time_payments * 5) - (late_payments * 15)
```

The score is clamped between 300 and 850.

### Breakdown Components

- **income_contrib**: Income divided by 1000
- **balance_contrib**: Average balance divided by 500
- **on_time_contrib**: On-time payments multiplied by 5
- **late_penalty**: Late payments multiplied by 15

### Advice Logic

- If late payments > 2: "Reduce late payments to improve your score."
- Otherwise: "Keep paying on time to maintain growth."

## Authentication

The API supports optional API key authentication via the `x-api-key` header.

- If `API_KEY` is set in `.env`, authentication is required
- If `API_KEY` is not set, the endpoint is public
- Invalid or missing keys return 401/403 errors

## Error Handling

The API returns standardized error responses:

### 400 Bad Request
```json
{
  "error": "Validation Error",
  "message": "Income must be a non-negative number"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "message": "Please provide x-api-key header"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "The requested endpoint does not exist"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Server port | 3000 | No |
| API_KEY | API authentication key | - | No |
| NODE_ENV | Environment mode | development | No |

## Development

Run in development mode:

```bash
npm run dev
```

## Production Deployment

This API is ready for production deployment on platforms like:

- AWS Lambda (with Express adapter)
- Google Cloud Run
- Heroku
- DigitalOcean App Platform
- Railway
- Render
- Vercel (serverless)

### Environment Setup for Production

Set these environment variables in your hosting platform:

```
PORT=3000
API_KEY=your_secure_api_key_here
NODE_ENV=production
```

## Integration Example

### JavaScript/Node.js

```javascript
const axios = require('axios');

const predictCreditScore = async (financialData) => {
  try {
    const response = await axios.post('http://localhost:3000/credit/predict',
      financialData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'finpilot_api_key_2024_secure'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

const data = {
  income: 75000,
  avg_balance: 5000,
  on_time_payments: 24,
  late_payments: 1
};

predictCreditScore(data);
```

### Python

```python
import requests

url = 'http://localhost:3000/credit/predict'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'finpilot_api_key_2024_secure'
}
data = {
    'income': 75000,
    'avg_balance': 5000,
    'on_time_payments': 24,
    'late_payments': 1
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

## License

MIT

## Support

For issues or questions, please contact the development team.
