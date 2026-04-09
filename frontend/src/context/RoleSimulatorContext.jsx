import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RoleSimulatorContext = createContext(null);

export const RoleSimulatorProvider = ({ children }) => {
  const [fakeRole, setFakeRole] = useState(() => {
    const savedRole = localStorage.getItem("cm360_fake_role");
    return savedRole || "admin";
  });

  useEffect(() => {
    localStorage.setItem("cm360_fake_role", fakeRole);
  }, [fakeRole]);

  const toggleRole = () => {
    setFakeRole((prevRole) =>
      prevRole === "admin" ? "instructor" : "admin"
    );
  };

  const value = useMemo(
    () => ({
      fakeRole,
      setFakeRole,
      toggleRole,
      isAdmin: fakeRole === "admin",
      isInstructor: fakeRole === "instructor",
    }),
    [fakeRole]
  );

  return (
    <RoleSimulatorContext.Provider value={value}>
      {children}
    </RoleSimulatorContext.Provider>
  );
};

export const useRoleSimulator = () => {
  const context = useContext(RoleSimulatorContext);

  if (!context) {
    throw new Error(
      "useRoleSimulator debe usarse dentro de un RoleSimulatorProvider"
    );
  }

  return context;
};