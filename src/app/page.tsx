"use client";

import { ReactNode } from "react";
import GraphCanvas from "@/components/GraphCanvas";
import React from "react";

export default function Flow() {

    return (
        <React.StrictMode>
        <div>
            <GraphCanvas/>
        </div>
        </React.StrictMode>
    )
}