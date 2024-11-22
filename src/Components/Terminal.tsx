import { useEffect, useRef, useState } from "react";
import projects from "../assets/projects.json";

interface CommandInterface {
  command: string;
  output: string;
}

function Terminal() {
  const [command, setCommand] = useState<string>("");
  const [cmd, setCmd] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const commands: CommandInterface[] = [
    { command: "help", output: "get all commands" },
    { command: "clear", output: "clear terminal" },
    { command: "about", output: "about me" },
    { command: "education", output: "my education" },
    { command: "socials", output: "all social profiles" },
    { command: "history", output: "get previous commands" },
    { command: "projects", output: "get all projects" },
    { command: "gui", output: "go to gui portfolio" },
  ];

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      setCmd((prev) => [...prev, command]);
      executeCommand(command);
      setCommand("");
    }

    if (e.code === "ArrowUp" || e.code === "ArrowDown") {
      const newIndex = e.code === "ArrowUp" ? cmd.length - 1 : 0; // Example for basic navigation
      setCommand(cmd[newIndex] || "");
    }
  };

  const executeCommand = (command: string) => {
    let output: string = "";
    const gitCommandRegex = /^projects git (\d+)$/;
    const liveCommandRegex = /^projects live (\d+)$/;

    const gitMatch = command.match(gitCommandRegex);
    const liveMatch = command.match(liveCommandRegex);

    // Check for git or live command
    if (gitMatch || liveMatch) {
      const projectIndex = gitMatch
        ? parseInt(gitMatch[1], 10) - 1
        : liveMatch
        ? parseInt(liveMatch[1], 10) - 1
        : -1;

      if (projectIndex < 0 || projectIndex >= projects.projects.length) {
        setOutput((prev) => [...prev, "Index out of bounds..."]);
      } else {
        if (gitMatch) {
          console.log("Opening GitHub Repo");
          setOutput((prev) => [...prev, "Opening GitHub Repo..."]);
          window.open(projects.projects[projectIndex].gitLink)?.focus();
        } else if (liveMatch) {
          console.log("Opening Live Link");
          setOutput((prev) => [...prev, "Opening Live Link..."]);
          window.open(projects.projects[projectIndex].liveLink)?.focus();
        }
      }
    } else {
      // Handle other commands
      commands.forEach((c) => {
        if (c.command === command) {
          output = c.output;
        }
      });

      if (command === "socials go to 1") getOutput("github");
      if (command === "socials go to 2") getOutput("X");
      if (command === "socials go to 3") getOutput("linkedin");
      getOutput(output);
    }
  };

  const getOutput = (output: string) => {
    switch (output) {
      case "get all commands":
        getCommands();
        break;

      case "clear terminal":
        setOutput([]);
        setCmd([]);
        break;

      case "get previous commands":
        const historyOutput =
          "Previous Commands:\n" +
          cmd.map((command, idx) => `${idx + 1}: ${command}`).join("\n");
        setOutput((prev) => [...prev, historyOutput]);
        break;

      case "about me":
        const about =
          "Hi, my name is Sameer Vohra \n I'm a Final Year student at Chitkara University \n I'm passionate about writing code and solving real-life problems";
        setOutput((prev) => [...prev, about]);
        break;

      case "my education":
        const education = `B.E in Computer Science Engineering\n\t- Chitkara University (2021-2025)\n\t- CGPA: 9.29/10\n12th Grade\n\t- Delhi Public School\n\t- Percentage: 74.2%\n10th Grade\n\t- Delhi Public School\n\t- Percentage: 84.2%`;
        setOutput((prev) => [...prev, education]);
        break;

      case "all social profiles":
        const socials =
          "1. Github \n2. X(Twitter) \n3. Linkedin \n\t\- Usage: socials go to <social no.> \n\t- eg: socials go to 1";
        setOutput((prev) => [...prev, socials]);
        break;

      case "github":
        window.open("https://github.com/SameerVohra", "_blank")?.focus();
        setOutput((prev) => [...prev, "Opening github...."]);
        break;

      case "X":
        window.open("https://x.com/__sameervohra__", "_blank")?.focus();
        setOutput((prev) => [...prev, "Opening X...."]);
        break;

      case "linkedin":
        window.open("https://www.linkedin.com/in/sameer-vohra/", "_blank")?.focus();
        setOutput((prev) => [...prev, "Opening Linkedin...."]);
        break;

      case "get all projects":
        const pName = projects.projects
          .map(
            (p, idx) =>
              `${idx + 1}: ${p.name} \n\t Github: ${p.gitLink} \n\t Live Link: ${p.liveLink}\n`
          )
          .join("\n");
        const instruction =
          pName +
          "\nUsage: projects git <project no.> OR projects live <project no.> \n\t - eg: projects git 12\n\t\t projects live 12";
        setOutput((prev) => [...prev, instruction]);
        console.log(projects.projects);
        break;

      case "go to gui portfolio":
        window.open("https://sameervohra-portfolio.vercel.app/", "_blank")?.focus();
        setOutput((prev) => [...prev, "Opening GUI portfolio"]);
        break;

      default:
        setOutput((prev) => [...prev, "Command not found"]);
        break;
    }
  };

  const getCommands = () => {
    const allCommands = commands.map((c) => c.command).join("\n");
    setOutput((prev) => [...prev, allCommands]);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [cmd, output]);

  // Set focus on input box when the terminal is clicked
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="h-screen w-full flex justify-center items-center overflow-auto shadow-2xl shadow-red-500"
      onClick={handleTerminalClick}
    >
      <div className="border-2 border-black h-3/4 w-3/4 bg-gray-900 rounded-lg flex flex-col">
        {/* Header */}
        <div className="border-2 bg-black border-black h-8 w-full flex justify-end items-center space-x-1">
          <div className="border border-black bg-yellow-300 h-4 w-4 rounded-full hover:cursor-pointer"></div>
          <div className="border border-black bg-green-400 h-4 w-4 rounded-full hover:cursor-pointer"></div>
          <div className="border border-black bg-red-600 h-4 w-4 rounded-full hover:cursor-pointer mr-2"></div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-pink-900" ref={terminalRef}>
          {cmd.map((c, idx) => (
            <div key={idx}>
              <p className="text-green-500 font-bold">
                <span className="text-white">&#62; </span>Guest
                <span className="text-white">@</span>SameerVohraPortfolio:{" "}
                <span className="text-white">~$</span>{" "}
                <span className="text-white font-mono">{c}</span>
              </p>
              {output[idx] && (
                <pre className="pl-4 text-gray-300 font-semibold text-lg whitespace-pre-line">
                  {output[idx]}
                </pre>
              )}
            </div>
          ))}

          <div>
            <p className="text-green-500 font-bold flex items-center">
              <span className="text-white">&#62; </span>Guest
              <span className="text-white">@</span>SameerVohraPortfolio:{" "}
              <span className="text-white">~$</span>{" "}
              <input
                className="outline-none bg-transparent text-lg text-gray-300 font-mono w-auto ml-2"
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
                ref={inputRef}
                placeholder="help, about, projects, socials, ....."
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terminal;
