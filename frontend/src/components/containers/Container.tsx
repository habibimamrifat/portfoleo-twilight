interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="mx-auto h-full w-full max-w-[1444px]">
      {children}
    </div>
  );
}