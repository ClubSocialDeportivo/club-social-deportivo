import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RoleSimulatorContext = createContext(null);

export const RoleSimulatorProvider = ({ children }) => {
  const [fakeRole, setFakeRole] = useState(() => {
    const savedRole = localStorage.getItem("cm360_fake_role");
    return savedRole || "admin";
  });

  const [fakeInstructorId, setFakeInstructorId] = useState(() => {
    const savedInstructorId = localStorage.getItem("cm360_fake_instructor_id");
    return savedInstructorId ? Number(savedInstructorId) : 13;
  });

  useEffect(() => {
    localStorage.setItem("cm360_fake_role", fakeRole);
  }, [fakeRole]);

  useEffect(() => {
    localStorage.setItem("cm360_fake_instructor_id", String(fakeInstructorId));
  }, [fakeInstructorId]);

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
      fakeInstructorId,
      setFakeInstructorId,
      isAdmin: fakeRole === "admin",
      isInstructor: fakeRole === "instructor",
    }),
    [fakeRole, fakeInstructorId]
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