import Logout from "../components/Logout";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
    <>
        {children}
        <Logout/>
    </>
    );
}