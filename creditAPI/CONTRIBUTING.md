# Contributing to FinPilot Credit Predictor API

Thank you for your interest in contributing to the FinPilot Credit Predictor API! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [Submitting Changes](#submitting-changes)
7. [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/finpilot-credit-api.git
   cd finpilot-credit-api
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-payment-history`)
- `bugfix/` - Bug fixes (e.g., `bugfix/validation-error`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/controller-logic`)

### Workflow Steps

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the coding standards

3. Test your changes thoroughly:
   ```bash
   npm test
   npm run build
   ```

4. Commit your changes with descriptive messages:
   ```bash
   git commit -m "feat: add new feature description"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## Coding Standards

### JavaScript Style

- Use ES6+ features where appropriate
- Use `const` for immutable variables, `let` for mutable
- Follow existing code formatting and indentation (2 spaces)
- Use meaningful variable and function names
- Keep functions small and focused on a single responsibility

### Code Structure

```javascript
// Good
const calculateScore = (data) => {
  const { income, balance } = data;
  return income + balance;
};

// Avoid
const calc = (d) => {
  return d.income + d.balance;
};
```

### Error Handling

Always handle errors gracefully:

```javascript
try {
  // Your code
} catch (error) {
  console.error('Descriptive error message:', error);
  return res.status(500).json({
    error: 'Error Type',
    message: 'User-friendly message'
  });
}
```

### Documentation

- Add JSDoc comments for functions
- Document complex logic with inline comments
- Update README.md for new features
- Add test cases to TEST.md

Example JSDoc:

```javascript
/**
 * Predicts credit score based on financial data
 * @param {Object} data - Financial data object
 * @param {number} data.income - Annual income
 * @param {number} data.avg_balance - Average account balance
 * @param {number} data.on_time_payments - Number of on-time payments
 * @param {number} data.late_payments - Number of late payments
 * @returns {Object} Prediction result with score, breakdown, and advice
 */
const predictCredit = (data) => {
  // Implementation
};
```

## Testing

### Running Tests

Run the test suite before submitting:

```bash
npm test
```

### Writing Tests

When adding new features:

1. Add corresponding test cases to TEST.md
2. Test both success and error scenarios
3. Include edge cases
4. Verify input validation

### Manual Testing

Use curl to test your endpoints:

```bash
curl -X POST http://localhost:3000/credit/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{"income": 75000, "avg_balance": 5000, "on_time_payments": 24, "late_payments": 1}'
```

## Submitting Changes

### Pull Request Process

1. Update documentation for any new features
2. Add tests for new functionality
3. Ensure all tests pass
4. Update CHANGELOG.md (if exists)
5. Create a Pull Request with:
   - Clear title describing the change
   - Detailed description of what was changed and why
   - Reference any related issues

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested the changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass
```

### Commit Message Guidelines

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Maintenance tasks

Examples:
```bash
feat: add new credit scoring algorithm
fix: resolve validation error for negative values
docs: update API endpoint documentation
refactor: simplify controller logic
```

## Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**:
   - OS
   - Node.js version
   - npm version
6. **Logs**: Relevant error messages or logs
7. **Screenshots**: If applicable

### Feature Requests

When requesting features:

1. **Use Case**: Describe the problem you're trying to solve
2. **Proposed Solution**: Your suggested implementation
3. **Alternatives**: Other solutions you've considered
4. **Additional Context**: Any other relevant information

## Project Structure

Understanding the project structure:

```
finpilot-credit-api/
├── src/
│   ├── index.js              # Main server entry point
│   ├── routes/               # API route definitions
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Custom middleware
│   └── utils/                # Utility functions
├── .env.example              # Environment variable template
├── README.md                 # Project documentation
├── TEST.md                   # Testing documentation
└── package.json              # Dependencies and scripts
```

## Best Practices

### Security

- Never commit `.env` files
- Never hardcode secrets or API keys
- Validate all user input
- Use HTTPS in production
- Keep dependencies updated

### Performance

- Keep functions focused and efficient
- Avoid unnecessary computations
- Use appropriate data structures
- Profile code for bottlenecks

### Maintainability

- Write self-documenting code
- Keep functions under 50 lines when possible
- Follow DRY (Don't Repeat Yourself)
- Use consistent naming conventions

## Getting Help

If you need help:

1. Check existing documentation (README.md, TEST.md)
2. Search existing issues
3. Ask questions in issue discussions
4. Reach out to maintainers

## Recognition

Contributors will be acknowledged in:
- Project README
- Release notes
- Contributors list

Thank you for contributing to FinPilot Credit Predictor API!
