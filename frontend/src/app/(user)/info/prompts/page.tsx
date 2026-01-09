import React from "react";
import PromptsExamples from "@/app/(user)/info/prompts/PromptsExamples";
import getUser from "@/app/actions/session";

const PromptsPage = async () => {
  const user = await getUser();

  return <PromptsExamples user={user} />;
};

export default PromptsPage;
