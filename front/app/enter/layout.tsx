"use client";

const EnterLayout = ({ children }: any) => {
  return (
    <div className="min-w-[350px] max-w-[450px] h-screen bg-background-home bg-cover mx-auto">
      {children}
    </div>
  );
};

export default EnterLayout;
