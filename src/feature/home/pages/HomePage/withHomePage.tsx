import { RetailDetailType } from "@/feature/retailManagement/pages/RetailManagementPage/RetailManagementPage";
import { db } from "@/lib/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { HomePageProps, WithHomePageProps } from "./interface";

export function withHomePage(Component: React.FC<HomePageProps>) {
  function WithHomePage(props: WithHomePageProps) {
    const [retail, setRetail] = useState<RetailDetailType[]>([]);

    useEffect(() => {
      const fetchRetail = async () => {
        const querySnapshot = await getDocs(collection(db, "retail"));
        const retailData = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as RetailDetailType)
        );
        setRetail(retailData);
      };
      fetchRetail();
    }, []);

    const newProps = {
      retail,
      ...props,
    };
    return <Component {...newProps} />;
  }
  return WithHomePage;
}
