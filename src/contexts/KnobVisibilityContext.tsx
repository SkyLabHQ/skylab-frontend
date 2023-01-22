import {
    createContext,
    Dispatch,
    ReactElement,
    SetStateAction,
    useContext,
    useState,
} from "react";

export const KnobVisibilityContext = createContext({
    isKnobVisible: true,
    setIsKnobVisible: (() => ({})) as Dispatch<SetStateAction<boolean>>,
});

export const KnobVisibilityContextProvider = ({
    children,
}: {
    children: ReactElement;
}) => {
    const [isKnobVisible, setIsKnobVisible] = useState(true);

    return (
        <KnobVisibilityContext.Provider
            value={{ isKnobVisible, setIsKnobVisible }}
        >
            {children}
        </KnobVisibilityContext.Provider>
    );
};

export const useKnobVisibility = () => useContext(KnobVisibilityContext);
