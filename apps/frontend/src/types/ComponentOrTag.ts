import type { Component, VNode } from "vue"

export type ComponentOrTag = Component | VNode | keyof HTMLElementTagNameMap;
