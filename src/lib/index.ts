import type { Session } from "@supabase/supabase-js";
import {writable} from "svelte/store";

export const navState = writable({
    activeItem: "",
    session:<Session | null> null,
    
    defaultNav: [
        {
            category: "Voting System",
            items: [
                {
                    title: "",
                    url: "",
                },

                {
                    title: "",
                    url: "",
                }
            ]
        },
    ],

    adminNav: [

        {
            category: "Reports",
            items: [
                {
                    title: "Dashboard",
                    url: "/admin/dashboard",
                },

                {
                    title: "Votes",
                    url: "/admin/votes",
                }
            ]
        },

        {
            category: "Management",
            items: [
                {
                    title: "All Voters",
                    url: "/admin/voters",
                },

                {
                    title: "Positions",
                    url: "/admin/positions",
                },

                {
                    title: "Candidates",
                    url: "/admin/candidates",
                }
            ]
        },

    ]
})