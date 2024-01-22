import type { Session } from "@supabase/supabase-js";
import {writable} from "svelte/store";
import type { Writable } from "svelte/store";

import type { CreatedCandidateTB, CreatedPositionTB, CreatedVotersTB } from "./types";

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

    ],

    voterNav: [

    ],
});

//create position admin state management
export const positionState = writable({
    createdPositions:<CreatedPositionTB[] | null> null,
});

//create candidate admin state management
export const candidateState = writable({
    createdCandidates:<CreatedCandidateTB[] | null> null,
});

//create voters admin state management
export const voterState = writable({
    createdVoters:<CreatedVotersTB[] | null> null,
})

// voter state management
export const realVoterState = writable({
    createdCandidates:<CreatedCandidateTB[] | null> null,
})

