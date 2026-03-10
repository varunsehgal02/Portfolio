"use client";

import { useEffect, useState } from "react";
import { getData } from "@/lib/editableData";

export function useEditableData(key, defaultValue) {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        let mounted = true;
        getData(key, defaultValue)
            .then((nextValue) => {
                if (mounted) setValue(nextValue);
            })
            .catch(() => {
                if (mounted) setValue(defaultValue);
            });

        return () => {
            mounted = false;
        };
    }, [key, defaultValue]);

    return value;
}
