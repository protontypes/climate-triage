interface Props {
  children: React.ReactNode;
}

export default function FormatContent({ children }: Props): JSX.Element {
  return (
    <article className="prose prose-lg mb-10 lg:prose-xl dark:prose-invert">{children}</article>
  );
}
