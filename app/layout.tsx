import type { Metadata } from "next";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css"

export const metadata: Metadata = {
  title: "VTodo - An AI powered Todo App",
  description: "VTodo is an AI powered Todo App that helps you manage your tasks efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CopilotKit publicApiKey="ck_pub_dad76dc6437078f77e58360fa52488ef">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}