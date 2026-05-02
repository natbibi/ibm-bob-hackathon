# CodeScan AI

AI-powered code vulnerability detection, risk scoring, and smart suggestions using IBM Watson Natural Language Understanding.

## 🚀 Features

- **🤖 AI-Powered Analysis** - Leverages IBM Watson NLU for intelligent code analysis
- **🔍 Vulnerability Detection** - Identifies exposed secrets, SQL injection, XSS, and more
- **📊 Risk Scoring** - Overall health score (0-100) with detailed severity breakdown
- **💡 Smart Suggestions** - Actionable AI-generated recommendations
- **📈 Visual Dashboard** - Beautiful charts and metrics for code quality insights
- **🎯 Multi-Language Support** - Supports 13+ programming languages
- **⚡ Real-time Processing** - Fast analysis with instant results

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **AI/ML**: IBM Watson Natural Language Understanding
- **Icons**: Lucide React
- **File Upload**: React Dropzone
- **ID Generation**: UUID

## 📋 Prerequisites

- Node.js 18+ and npm
- IBM Watson Natural Language Understanding API credentials

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
WATSON_API_KEY=your_watson_api_key
WATSON_URL=your_watson_service_url
WATSON_VERSION=2023-07-15
```

**To get Watson credentials**:
- Sign up for IBM Cloud: https://cloud.ibm.com/
- Create a Natural Language Understanding service
- Copy your API key and service URL from the credentials page

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
- Watson NLU processes your code for vulnerabilities and patterns
- Fallback rule-based analysis if Watson is unavailable

### 3. View Results
The comprehensive dashboard shows:
- **Health Score**: Overall code quality (0-100)
- **Stat Cards**: Key metrics (vulnerabilities, high-risk issues, missing tests)
- **Severity Breakdown**: Pie chart of critical/high/medium/low issues
- **Findings Table**: Sortable list of all detected vulnerabilities
- **AI Suggestions**: Actionable recommendations from Watson
- **Files Analyzed**: Details of each uploaded file

### 4. Download Report
- Export analysis results as JSON for record-keeping

## 🏗️ Project Structure

```
codescan-ai/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Watson API proxy + analysis logic
│   ├── dashboard/
│   │   └── page.tsx              # Results dashboard
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing/upload page
├── components/
│   └── Dashboard/
│       ├── FindingsTable.tsx     # Sortable vulnerabilities table
│       ├── HealthRing.tsx        # Animated health score ring
│       ├── SeverityChart.tsx     # Pie chart with severity breakdown
│       ├── StatCards.tsx         # KPI metric cards
│       └── SuggestionsList.tsx   # AI suggestions panel
├── lib/
│   ├── codeParser.ts             # File parsing utilities
│   ├── store.ts                  # Zustand state management
│   └── watsonClient.ts           # Watson API client
├── types/
│   └── analysis.ts               # TypeScript interfaces
├── .env.local                    # Environment variables
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🎨 Design System

### Colors
- **Primary**: `#6C63FF` (Purple)
- **Danger**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Amber)
- **Success**: `#10B981` (Green)
- **Background**: `#0F0F1A` (Dark)
- **Card**: `#1E1E2E` (Dark Gray)

### Language Badge Colors
- Python: Blue
- JavaScript: Yellow
- TypeScript: Blue
- Java: Orange
- Go: Cyan
- Ruby: Red
- Rust: Orange
- PHP: Purple
- C#: Green
- C++: Pink

## 🔍 Vulnerability Categories

The analyzer detects:
- **Exposed Secrets**: API keys, passwords, tokens
- **SQL Injection**: Unsafe database queries
- **XSS**: Cross-site scripting vulnerabilities
- **Hardcoded Credentials**: Passwords in code
- **Missing Authentication**: Unprotected routes
- **Dependency Issues**: Outdated or vulnerable packages
- **Other**: General code quality issues

## 📊 Severity Levels

- **Critical**: Immediate security risk (15 points deduction)
- **High**: Significant vulnerability (10 points deduction)
- **Medium**: Moderate issue (5 points deduction)
- **Low**: Minor concern (minimal impact)

## 🧪 Analysis Process

1. **File Upload**: Files are read and metadata extracted (language, LOC)
2. **Watson Analysis**: Code sent to Watson NLU for AI analysis
3. **Pattern Detection**: Keywords analyzed for security issues
4. **Fallback Analysis**: Rule-based detection if Watson unavailable
5. **Score Calculation**: Health score computed from findings
6. **Results Display**: Comprehensive dashboard with all metrics

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WATSON_API_KEY` | IBM Watson API key | Yes |
| `WATSON_URL` | Watson service URL | Yes |
| `WATSON_VERSION` | Watson API version | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🙏 Acknowledgments

- IBM Watson for Natural Language Understanding
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Recharts for beautiful charts

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using IBM Watson AI**