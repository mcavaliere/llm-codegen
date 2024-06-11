export function stripMarkdown(str: string): string {
  return str.replace(/```(?:\w+\n)?([\s\S]*?)```/g, "$1");
}
