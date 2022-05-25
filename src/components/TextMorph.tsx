import { Text } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useState } from "react";
import { randomizeString } from "../utils";

interface TextMorphProps {
    defaultText: string;
    selector: string;
    morphText?: string;
}

const TextMorph = ({
    defaultText,
    morphText,
    selector,
}: TextMorphProps): ReactElement => {
    // state
    const el = document.querySelector(`.${selector}`);
    const [textScramble, setTextScramble] = useState<TextMorphGenerator>(new TextMorphGenerator(el!));
    let randomMorphText = morphText ?? defaultText;
    randomMorphText = randomizeString(randomMorphText);

    // set the text on element change initially to randomized morph text
    useEffect(() => {
        setTextScramble(new TextMorphGenerator(el!));
        textScramble.setText(randomMorphText);
    }, [el, defaultText]);

    return (
        <Text
            textAlign="center"
            className={selector}
            onMouseEnter={() => textScramble?.setText(defaultText)}
        >
            {randomMorphText}
        </Text>
    );
};

class TextMorphGenerator {
    private el: Element;
    private chars: string;
    private queue: {
        from: string;
        to: string;
        start: number;
        end: number;
        char?: string;
    }[];
    private resolve: (value: unknown) => void;
    private frameRequest: number;
    private frame: number;
    constructor(el: Element) {
        this.resolve = () => null;
        this.queue = [];
        this.el = el;
        this.frame = 0;
        this.frameRequest = 0;
        this.chars = "!<>-_\\/[]{}—=+*^?#___";
        this.update = this.update.bind(this);
    }
    setText(newText: string) {
        const oldText = this.el?.textContent;
        const length = Math.max(oldText?.length || 0, newText.length);
        const promise = new Promise((resolve) => (this.resolve = resolve));
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText?.[i] || "";
            const to = newText[i] || "";
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = "";
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span style="color: #757575;">${char}</span>`;
            } else {
                output += from;
            }
        }
        if (this.el) {
            this.el.innerHTML = output;
        }
        if (complete === this.queue.length) {
            this.resolve({});
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

export default TextMorph;
