import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import SheetMenu from "./sheet-menu";
import { RiMenuLine } from "react-icons/ri";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/ui/sheet";
import { Button } from "@/ui/Button";
import Link from "next/link";

describe("SheetMenu", () => {
    it("renders the menu button", () => {
        render(<SheetMenu />);
        const menuButton = screen.getByRole("button");
        expect(menuButton).toBeInTheDocument();
        expect(menuButton).toContainElement(screen.getByTestId("menu-icon"));
    });

    it("opens the sheet when the menu button is clicked", () => {
        render(<SheetMenu />);
        const menuButton = screen.getByRole("button");
        fireEvent.click(menuButton);
        const sheetContent = screen.getByRole("dialog");
        expect(sheetContent).toBeInTheDocument();
    });

    it("renders the menu items correctly", () => {
        render(<SheetMenu />);
        fireEvent.click(screen.getByRole("button"));
        const menuItems = screen.getAllByRole("link");
        expect(menuItems).toHaveLength(5); // 4 navigation items + 1 rental agreement
        expect(screen.getByText("Rental Agreement")).toBeInTheDocument();
        expect(screen.getByText("For Buyers")).toBeInTheDocument();
        expect(screen.getByText("For Tenants")).toBeInTheDocument();
        expect(screen.getByText("For Owners")).toBeInTheDocument();
        expect(screen.getByText("For Builders")).toBeInTheDocument();
    });

    it("closes the sheet when a menu item is clicked", () => {
        render(<SheetMenu />);
        fireEvent.click(screen.getByRole("button"));
        const menuItem = screen.getByText("For Buyers");
        fireEvent.click(menuItem);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});