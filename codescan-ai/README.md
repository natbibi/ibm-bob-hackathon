# CodeGuardian AI

AI-powered code vulnerability detection, risk scoring, and smart suggestions using IBM watsonx.ai (Granite models).

## 🚀 Features

- **🤖 AI-Powered Analysis** - Leverages IBM Granite AI for intelligent, structured code analysis
- **🔍 Vulnerability Detection** - Identifies exposed secrets, SQL injection, XSS, weak crypto, and more
- **📊 Risk Scoring** - Overall health score (0-100) with detailed severity breakdown
- **💡 Smart Suggestions** - Actionable AI-generated recommendations with step-by-step plans
- **📈 Visual Dashboard** - Glassmorphism dark-theme dashboard with charts and metrics
- **🎯 Multi-Language Support** - Supports 13+ programming languages
- **⚡ Real-time Processing** - Fast analysis with instant results

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **AI/ML**: IBM watsonx.ai — Granite models (`ibm/granite-3-8b-instruct`)
- **Icons**: Lucide React
- **File Upload**: React Dropzone
- **ID Generation**: UUID

## 📋 Prerequisites

- Node.js 18+ and npm
- IBM watsonx.ai API credentials

## 🔧 Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd codescan-ai
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:

Create a `.env.local` file in the root directory:

```env
WATSONX_API_KEY=your_ibm_cloud_api_key
WATSONX_PROJECT_ID=your_watsonx_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

**To get watsonx credentials**:
- Sign up for IBM Cloud: https://cloud.ibm.com/
- Create a watsonx.ai project
- Copy your API key and project ID from the credentials page

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### 1. Upload Code Files
- Drag and drop or click to browse for code files
- Maximum 5 files per analysis
- Supported file types: `.py`, `.js`, `.jsx`, `.ts`, `.tsx`, `.java`, `.go`, `.rb`, `.php`, `.cs`, `.cpp`, `.c`, `.rs`

### 2. Analyze
- Click "Analyze Code" to start the AI analysis
- IBM Granite processes your code for vulnerabilities and patterns
- Fallback rule-based analysis if watsonx is unavailable

### 3. View Results
The comprehensive dashboard shows:
- **Health Score**: Overall code quality (0-100)
- **Stat Cards**: Key metrics (total issues, critical issues, security risk, files analyzed)
- **Vulnerability Breakdown**: Pie chart of critical/high/medium/low issues
- **Top Issue Categories**: Ranked categories of detected problems
- **AI-Powered Insights**: Actionable insights from IBM Granite
- **Most Critical Issues**: Expandable list with full details and fix recommendations
- **Code Snippets**: Highlighted vulnerable code with context
- **AI Recommendations**: Step-by-step remediation plans
- **Additional Insights**: Code metrics (coverage, duplication, technical debt)

### 4. Download Report
- Click "Download Report" in the navbar to export the full analysis as JSON

## 🏗️ Project Structure

```
codescan-ai/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # watsonx API proxy + analysis logic
│   ├── dashboard/
│   │   └── page.tsx              # Results dashboard
│   ├── upload/
│   │   └── page.tsx              # File upload page
│   ├── globals.css               # Global styles & animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── lib/
│   ├── store.ts                  # Zustand state management
│   └── watsonClient.ts           # watsonx.ai Granite client
├── types/
│   └── analysis.ts               # TypeScript interfaces
├── .env.local                    # Environment variables (not committed)
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🎨 Design System

### Colors
- **Primary**: `#6C63FF` (Purple)
- **Danger**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Amber)
- **Success**: `#10B981` (Green)
- **Background**: `#07070F` (Deep Dark)
- **Card**: `#0F0F1A` (Dark)

## 🔍 Vulnerability Categories

The analyzer detects:
- **Exposed Secrets**: API keys, passwords, tokens
- **SQL Injection**: Unsafe database queries
- **XSS**: Cross-site scripting vulnerabilities
- **Hardcoded Credentials**: Passwords in code
- **Weak Cryptography**: MD5, SHA1, insecure algorithms
- **Missing Authentication**: Unprotected routes
- **Input Validation**: Missing sanitization
- **Code Smells**: Long functions, dead code, TODO comments
- **Best Practices**: Security headers, error handling

## 📊 Severity Levels

- **Critical**: Immediate security risk (15 points deduction)
- **High**: Significant vulnerability (10 points deduction)
- **Medium**: Moderate issue (5 points deduction)
- **Low**: Minor concern (minimal impact)

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WATSONX_API_KEY` | IBM Cloud API key | Yes |
| `WATSONX_PROJECT_ID` | watsonx.ai project ID | Yes |
| `WATSONX_URL` | watsonx.ai endpoint URL | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

---

**Built with ❤️ using IBM watsonx.ai (Granite)**
