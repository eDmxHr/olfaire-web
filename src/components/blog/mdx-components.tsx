import { Heading } from "@/components/ui/heading";

type MDXChild = { children?: React.ReactNode };

export type MDXComponents = Record<
  string,
  React.ComponentType<Record<string, unknown>>
>;

export const mdxComponents: MDXComponents = {
  h1: ({ children }: MDXChild) => (
    <Heading as="h1" size="page" className="mb-6">
      {children}
    </Heading>
  ),
  h2: ({ children }: MDXChild) => (
    <Heading as="h2" size="card" className="mt-10 mb-4">
      {children}
    </Heading>
  ),
  h3: ({ children }: MDXChild) => (
    <h3 className="text-ink font-medium text-base mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }: MDXChild) => (
    <p className="text-ash leading-relaxed">{children}</p>
  ),
  strong: ({ children }: MDXChild) => (
    <strong className="font-medium text-ink">{children}</strong>
  ),
  em: ({ children }: MDXChild) => <em className="italic text-ash">{children}</em>,
  ul: ({ children }: MDXChild) => (
    <ul className="list-disc list-inside space-y-2 text-ash text-sm leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }: MDXChild) => (
    <ol className="list-decimal list-inside space-y-2 text-ash text-sm leading-relaxed">
      {children}
    </ol>
  ),
  blockquote: ({ children }: MDXChild) => (
    <blockquote className="bg-linen rounded-xl p-6 my-8 border-l-2 border-amber">
      <div className="serif text-lg font-light italic text-ink leading-relaxed m-0">
        {children}
      </div>
    </blockquote>
  ),
  LumiNote: ({ children }: MDXChild) => (
    <div className="bg-linen rounded-xl p-6 my-10">
      <p className="eyebrow text-amber mb-3">Lumi on this</p>
      <div className="serif text-lg font-light italic text-ink leading-relaxed">
        {children}
      </div>
    </div>
  ),
  hr: () => <hr className="border-dust my-10" />,
};
