# FinPilot Credit Predictor API - Testing Guide

This document provides comprehensive testing instructions for the Credit Predictor API.

## Table of Contents

1. [Quick Start Testing](#quick-start-testing)
2. [API Endpoint Tests](#api-endpoint-tests)
3. [Authentication Tests](#authentication-tests)
4. [Validation Tests](#validation-tests)
5. [ML Model Tests](#ml-model-tests)
6. [Error Handling Tests](#error-handling-tests)
7. [Integration Tests](#integration-tests)
8. [Performance Tests](#performance-tests)

---

## Quick Start Testing

### Prerequisites

1. Ensure the server is running:
```bash
npm start
```

2. Verify server is healthy:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-13T..."
}
```

---

## API Endpoint Tests

### Test 1: Root Endpoint

**Request:**
```bash
curl http://localhost:3000/
```

**Expected Response:**
```json
{
  "message": "FinPilot Credit Predictor API",
  "version": "1.0.0",
  "endpoints": {
    "predict": "POST /credit/predict"
  }
}
```

**Status Code:** 200 OK

---

### Test 2: Health Check

**Request:**
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-13T10:30:00.000Z"
}
```

**Status Code:** 200 OK

---

### Test 3: Basic Credit Prediction

**Request:**
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

**Expected Response:**
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

**Status Code:** 200 OK

**Validation:**
- Score should be between 300-850
- Breakdown values should match formula
- Advice should be appropriate

---

## Authentication Tests

### Test 4: Missing API Key

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -d '{
    "income": 75000,
    "avg_balance": 5000,
    "on_time_payments": 24,
    "late_payments": 1
  }'
```

**Expected Response:**
```json
{
  "error": "Authentication required",
  "message": "Please provide x-api-key header"
}
```

**Status Code:** 401 Unauthorized

---

### Test 5: Invalid API Key

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: wrong_key" \
  -d '{
    "income": 75000,
    "avg_balance": 5000,
    "on_time_payments": 24,
    "late_payments": 1
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid API key",
  "message": "The provided API key is not valid"
}
```

**Status Code:** 403 Forbidden

---

### Test 6: Valid API Key

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": 60000,
    "avg_balance": 3000,
    "on_time_payments": 18,
    "late_payments": 0
  }'
```

**Expected Response:**
```json
{
  "predicted_score": 456,
  "breakdown": {...},
  "advice": "Keep paying on time to maintain growth."
}
```

**Status Code:** 200 OK

---

## Validation Tests

### Test 7: Empty Request Body

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{}'
```

**Expected Response:**
```json
{
  "error": "Validation Error",
  "message": "Income must be a non-negative number"
}
```

**Status Code:** 400 Bad Request

---

### Test 8: Missing Required Fields

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": 75000
  }'
```

**Expected Response:**
```json
{
  "error": "Validation Error",
  "message": "Average balance must be a non-negative number"
}
```

**Status Code:** 400 Bad Request

---

### Test 9: Negative Income

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": -5000,
    "avg_balance": 5000,
    "on_time_payments": 24,
    "late_payments": 1
  }'
```

**Expected Response:**
```json
{
  "error": "Validation Error",
  "message": "Income must be a non-negative number"
}
```

**Status Code:** 400 Bad Request

---

### Test 10: Invalid Data Types

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": "seventy-five thousand",
    "avg_balance": 5000,
    "on_time_payments": 24,
    "late_payments": 1
  }'
```

**Expected Response:**
```json
{
  "error": "Validation Error",
  "message": "Income must be a non-negative number"
}
```

**Status Code:** 400 Bad Request

---

### Test 11: Decimal Values for Payments

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": 75000,
    "avg_balance": 5000,
    "on_time_payments": 24.5,
    "late_payments": 1
  }'
```

**Expected Response:**
```json
{
  "error": "Validation Error",
  "message": "On-time payments must be a non-negative integer"
}
```

**Status Code:** 400 Bad Request

---

## ML Model Tests

### Test 12: Minimum Credit Score (300)

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": 0,
    "avg_balance": 0,
    "on_time_payments": 0,
    "late_payments": 100
  }'
```

**Expected Response:**
```json
{
  "predicted_score": 300,
  "breakdown": {
    "income_contrib": 0,
    "balance_contrib": 0,
    "on_time_contrib": 0,
    "late_penalty": 1500
  },
  "advice": "Reduce late payments to improve your score."
}
```

**Status Code:** 200 OK

**Validation:** Score should be clamped at 300

---

### Test 13: Maximum Credit Score (850)

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": 500000,
    "avg_balance": 100000,
    "on_time_payments": 100,
    "late_payments": 0
  }'
```

**Expected Response:**
```json
{
  "predicted_score": 850,
  "breakdown": {
    "income_contrib": 500,
    "balance_contrib": 200,
    "on_time_contrib": 500,
    "late_penalty": 0
  },
  "advice": "Keep paying on time to maintain growth."
}
```

**Status Code:** 200 OK

**Validation:** Score should be clamped at 850

---

### Test 14: Good Credit Profile

**Request:**
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

**Expected Response:**
```json
{
  "predicted_score": 690,
  "breakdown": {
    "income_contrib": 120,
    "balance_contrib": 30,
    "on_time_contrib": 240,
    "late_penalty": 0
  },
  "advice": "Keep paying on time to maintain growth."
}
```

**Status Code:** 200 OK

**Validation:** Score should be in "good" range (670-739)

---

### Test 15: Poor Credit Profile (Many Late Payments)

**Request:**
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

**Expected Response:**
```json
{
  "predicted_score": 342,
  "breakdown": {
    "income_contrib": 35,
    "balance_contrib": 2,
    "on_time_contrib": 25,
    "late_penalty": 120
  },
  "advice": "Reduce late payments to improve your score."
}
```

**Status Code:** 200 OK

**Validation:**
- Score should be in "poor" range
- Advice should recommend reducing late payments

---

### Test 16: Advice Threshold Test (Exactly 2 Late Payments)

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": 60000,
    "avg_balance": 4000,
    "on_time_payments": 20,
    "late_payments": 2
  }'
```

**Expected Response:**
```json
{
  "predicted_score": 448,
  "breakdown": {...},
  "advice": "Keep paying on time to maintain growth."
}
```

**Status Code:** 200 OK

**Validation:** With exactly 2 late payments, advice should be positive

---

### Test 17: Advice Threshold Test (3 Late Payments)

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": 60000,
    "avg_balance": 4000,
    "on_time_payments": 20,
    "late_payments": 3
  }'
```

**Expected Response:**
```json
{
  "predicted_score": 433,
  "breakdown": {...},
  "advice": "Reduce late payments to improve your score."
}
```

**Status Code:** 200 OK

**Validation:** With 3 late payments, advice should warn about late payments

---

## Error Handling Tests

### Test 18: Invalid Endpoint

**Request:**
```bash
curl http://localhost:3000/invalid-endpoint
```

**Expected Response:**
```json
{
  "error": "Not Found",
  "message": "The requested endpoint does not exist"
}
```

**Status Code:** 404 Not Found

---

### Test 19: Wrong HTTP Method

**Request:**
```bash
curl -X GET http://localhost:3000/credit/predict \
  -H "x-api-key: finpilot_api_key_2024_secure"
```

**Expected Response:**
```json
{
  "error": "Not Found",
  "message": "The requested endpoint does not exist"
}
```

**Status Code:** 404 Not Found

---

### Test 20: Malformed JSON

**Request:**
```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{income: 75000, invalid json'
```

**Expected Response:**
```json
{
  "error": "Internal Server Error",
  "message": "An error occurred while processing your request"
}
```

**Status Code:** 500 Internal Server Error

---

## Integration Tests

### Test 21: JavaScript/Node.js Integration

Create a test file `test-integration.js`:

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:3000/credit/predict';
const API_KEY = 'finpilot_api_key_2024_secure';

async function testPrediction() {
  try {
    const response = await axios.post(API_URL, {
      income: 80000,
      avg_balance: 6000,
      on_time_payments: 30,
      late_payments: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    });

    console.log('✓ Test passed');
    console.log('Predicted Score:', response.data.predicted_score);
    console.log('Advice:', response.data.advice);
    return true;
  } catch (error) {
    console.error('✗ Test failed:', error.response?.data || error.message);
    return false;
  }
}

testPrediction();
```

Run with:
```bash
node test-integration.js
```

---

### Test 22: Python Integration

Create a test file `test_integration.py`:

```python
import requests
import json

API_URL = 'http://localhost:3000/credit/predict'
API_KEY = 'finpilot_api_key_2024_secure'

def test_prediction():
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
    }

    data = {
        'income': 80000,
        'avg_balance': 6000,
        'on_time_payments': 30,
        'late_payments': 1
    }

    try:
        response = requests.post(API_URL, json=data, headers=headers)
        response.raise_for_status()

        result = response.json()
        print('✓ Test passed')
        print(f"Predicted Score: {result['predicted_score']}")
        print(f"Advice: {result['advice']}")
        return True
    except Exception as e:
        print(f'✗ Test failed: {e}')
        return False

if __name__ == '__main__':
    test_prediction()
```

Run with:
```bash
python test_integration.py
```

---

## Performance Tests

### Test 23: Response Time

**Request:**
```bash
time curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: finpilot_api_key_2024_secure" \
  -d '{
    "income": 75000,
    "avg_balance": 5000,
    "on_time_payments": 24,
    "late_payments": 1
  }'
```

**Expected:** Response time should be under 100ms

---

### Test 24: Concurrent Requests

Create a test file `test-load.sh`:

```bash
#!/bin/bash

for i in {1..100}
do
  curl -X POST http://localhost:3000/credit/predict \
    -H "Content-Type: application/json" \
    -H "x-api-key: finpilot_api_key_2024_secure" \
    -d '{
      "income": 75000,
      "avg_balance": 5000,
      "on_time_payments": 24,
      "late_payments": 1
    }' &
done

wait
echo "All requests completed"
```

Run with:
```bash
chmod +x test-load.sh
./test-load.sh
```

**Expected:** All requests should complete successfully

---

## Test Summary Checklist

Use this checklist to verify all tests pass:

### Basic Functionality
- [ ] Root endpoint returns API info
- [ ] Health check returns healthy status
- [ ] Basic prediction returns valid credit score

### Authentication
- [ ] Missing API key returns 401
- [ ] Invalid API key returns 403
- [ ] Valid API key allows access

### Input Validation
- [ ] Empty request body returns 400
- [ ] Missing fields return 400
- [ ] Negative values return 400
- [ ] Invalid data types return 400
- [ ] Decimal payments return 400

### ML Model
- [ ] Minimum score (300) is enforced
- [ ] Maximum score (850) is enforced
- [ ] Good credit profile returns appropriate score
- [ ] Poor credit profile returns appropriate score
- [ ] Advice changes based on late payments threshold

### Error Handling
- [ ] Invalid endpoints return 404
- [ ] Wrong HTTP methods return 404
- [ ] Malformed JSON returns 500

### Performance
- [ ] Single request completes in under 100ms
- [ ] API handles concurrent requests

---

## Automated Test Script

Create a comprehensive test script `run-all-tests.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:3000"
API_KEY="finpilot_api_key_2024_secure"
PASSED=0
FAILED=0

echo "========================================="
echo "FinPilot Credit API - Test Suite"
echo "========================================="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health)
if [ "$RESPONSE" -eq 200 ]; then
  echo "✓ PASSED"
  ((PASSED++))
else
  echo "✗ FAILED (Expected 200, got $RESPONSE)"
  ((FAILED++))
fi
echo ""

# Test 2: Valid Prediction
echo "Test 2: Valid Prediction"
RESPONSE=$(curl -s -X POST $API_URL/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"income":75000,"avg_balance":5000,"on_time_payments":24,"late_payments":1}' \
  -w "%{http_code}" -o /tmp/test_response.json)
if [ "$RESPONSE" -eq 200 ]; then
  echo "✓ PASSED"
  ((PASSED++))
else
  echo "✗ FAILED (Expected 200, got $RESPONSE)"
  ((FAILED++))
fi
echo ""

# Test 3: Missing API Key
echo "Test 3: Missing API Key"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $API_URL/credit/predict \
  -H "Content-Type: application/json" \
  -d '{"income":75000,"avg_balance":5000,"on_time_payments":24,"late_payments":1}')
if [ "$RESPONSE" -eq 401 ]; then
  echo "✓ PASSED"
  ((PASSED++))
else
  echo "✗ FAILED (Expected 401, got $RESPONSE)"
  ((FAILED++))
fi
echo ""

# Test 4: Invalid API Key
echo "Test 4: Invalid API Key"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $API_URL/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: wrong_key" \
  -d '{"income":75000,"avg_balance":5000,"on_time_payments":24,"late_payments":1}')
if [ "$RESPONSE" -eq 403 ]; then
  echo "✓ PASSED"
  ((PASSED++))
else
  echo "✗ FAILED (Expected 403, got $RESPONSE)"
  ((FAILED++))
fi
echo ""

# Test 5: Invalid Input
echo "Test 5: Invalid Input (Negative Income)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $API_URL/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"income":-5000,"avg_balance":5000,"on_time_payments":24,"late_payments":1}')
if [ "$RESPONSE" -eq 400 ]; then
  echo "✓ PASSED"
  ((PASSED++))
else
  echo "✗ FAILED (Expected 400, got $RESPONSE)"
  ((FAILED++))
fi
echo ""

# Test 6: Invalid Endpoint
echo "Test 6: Invalid Endpoint"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/invalid)
if [ "$RESPONSE" -eq 404 ]; then
  echo "✓ PASSED"
  ((PASSED++))
else
  echo "✗ FAILED (Expected 404, got $RESPONSE)"
  ((FAILED++))
fi
echo ""

# Summary
echo "========================================="
echo "Test Results Summary"
echo "========================================="
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo "Total: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "✓ All tests passed!"
  exit 0
else
  echo "✗ Some tests failed"
  exit 1
fi
```

Run with:
```bash
chmod +x run-all-tests.sh
./run-all-tests.sh
```

---

## Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "FinPilot Credit API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/health",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["health"]
        }
      }
    },
    {
      "name": "Predict Credit Score",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "x-api-key",
            "value": "finpilot_api_key_2024_secure"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"income\": 75000,\n  \"avg_balance\": 5000,\n  \"on_time_payments\": 24,\n  \"late_payments\": 1\n}"
        },
        "url": {
          "raw": "http://localhost:3000/credit/predict",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["credit", "predict"]
        }
      }
    }
  ]
}
```

---

## Notes

- Ensure the server is running on port 3000 before running tests
- All tests assume default environment variables from `.env`
- For production testing, replace `localhost:3000` with your production URL
- Expected response values may vary slightly due to rounding

---

## Test Coverage

This test suite covers:
- ✓ All API endpoints
- ✓ Authentication flows
- ✓ Input validation
- ✓ ML model logic
- ✓ Error handling
- ✓ Edge cases
- ✓ Integration scenarios
- ✓ Performance benchmarks

**Total Tests:** 24+
