import type { Session } from "@supabase/supabase-js";
import {writable} from "svelte/store";
import type { CreatedCandidateTB, CreatedPositionTB } from "./types";

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
});


//create position admin state management
export const positionState = writable({
    createdPositions:<CreatedPositionTB[] | null> null,
});

//create candidate admin state management
export const candidateState = writable({
    createdCandidates:<CreatedCandidateTB[] | null> null,
});