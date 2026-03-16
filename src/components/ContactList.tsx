import { useState, useRef } from "react";

interface contactListItems {
    contact?: string
}

export function ContactList({ contact }: contactListItems) {
    if (!contact) return null
    else {
        return (
            <div>
                <p>teste</p>
            </div>
        )
    }

}