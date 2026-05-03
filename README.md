# 🥇 Hackathon: CodeGuardian (IBM Bob Hackathon)

This project is created for the [IBM Bob Hackathon](https://compete.052601.watsonx-challenge.ibm.com/competitions/bobdevday?mc_cid=253e4e3331&mc_eid=687fc6e7e2)

Live URL: https://ibm-bob-hackathon-nu.vercel.app/

Video demo URL: https://drive.google.com/file/d/1c9IQEKDH4Qv0-iwzQTXOAVzKIubxBNa8/view

## Description 
CodeGuardian is an intelligent code analysis tool designed to help developers quickly identify security vulnerabilities, assess risk, and improve code quality without the need for time-consuming manual reviews. Developers often lack fast and accessible tools to detect security issues early in the development process. This is the challenge CodeGuardian was created to solve. Reviewing code line by line is time consuming, tedious and also error prone. Exposed secrets, SQL injection risks or insecure patterns can be easily missed especially under time pressures or rapid prototyping. Critical issues can therefore be overlooked until later in the development cycle which can be costly and difficult to fix. The platform supports many programming languages, making it flexible for all developers.

CodeGuardian can reduce these issues by providing a simple and fast solution in a visually engaging interface where users can upload code files and receive immediate feedback. Using IBM Watson Natural Language Understanding, code files are throughly analysed and any common vulnerability patterns are detected. CodeGuardian then produces actionable AI-driven suggestions for improvement in a modern dashboard. An overall health score is provided, giving developers a quick snapshot of their code's security, as well as a detailed breakdown of vulnerabilities categorised by severity and a clear explanation and suggested fix is provided for each identified issue. This helps developers identify problems and understand how to resolve them. Whilst existing technologies exist that scan code, CodeGuardian is the first to display the information using beginner friendly insights and a clean visual dashboard without needing any set up or expert knowledge to use.

Using charts, metrics and sortable tables, the dashboard provides findings in a functional and intuitive way. A traditionally complex and technical process becomes accessible and actionable, especially for less experienced developers. Futhermore, users can export their analysis results as JSON, making it easy to integrate with other tools or workflows.

Ultimately, CodeGuardian aims to save developers time and reduces the risk of overlooked issues whilst enhancing developer understanding and decision making. This will no doubt create immense impact to development teams who with CodeGuardian ship faster, and safer.

CodeGuardian is designed not only as a standalone tool, but as a scalable solution that can integrate into IDEs and development workflows such as CI/CD pipelines, enabling teams to continuously monitor and improve code security at scale


## Technologies
CodeGuardian uses IBM watson ai to conduct the code analysis of uploaded files. Lines of code are extracted from the file and sent to IBM Granite 8B instruct model with specific instructions to analyse code as if they were a professional developer with multiple perspectives, particularly from a security, and code quality point of view. 

IBM Bob was used as a coding assistant.
