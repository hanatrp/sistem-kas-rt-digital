# Sistem Kas RT Digital - Design System

This document outlines the design system, colors, typography, and component specifications for the **Sistem Kas RT Digital** (CivicTrust RT) project. The design system is built to ensure transparency, community stability, and ease of use for a diverse age demographic within a neighborhood setting.

---

## Brand & Style

The brand personality is **institutional yet accessible**, moving away from bureaucratic complexity toward digital-first simplicity. 

- **Visual Style**: Modern Corporate
- **Inspiration**: Blends the systematic logic of Material Design 3 with the soft, translucent depth of Fluent Design.
- **Key Focus**: High legibility, reassuring aesthetic for financial transactions and community safety, organized calm, and generous whitespace to reduce cognitive load.

---

## Color Palette

The palette is rooted in stability and trust. The primary deep navy establishes authority, while teals and semantic colors handle user interaction and financial status indication.

### Core Brand Colors

| Color | HEX | Preview | Description / Purpose |
| :--- | :--- | :--- | :--- |
| **Primary** | `#002045` | `■` | Deep Navy. Core navigation, headers, and authority elements. |
| **Primary Container** | `#1A365D` | `■` | Medium Navy. Used for card backgrounds or primary hover/active states. |
| **Secondary** | `#29695b` | `■` | Deep Teal. Primary action elements, interactive accents, and highlights. |
| **Secondary Container** | `#acedda` | `■` | Soft Green/Teal. Used for secondary containers, highlights, or badges. |
| **Tertiary** | `#321b00` | `■` | Dark Gold/Bronze. Specialized accents or community badges. |
| **Tertiary Container** | `#4f2e00` | `■` | Warm Brown/Bronze container. |

### Surface & Background Colors

| Color | HEX | Preview | Description / Purpose |
| :--- | :--- | :--- | :--- |
| **Background** | `#f9f9ff` | `■` | Base background color of the application canvas. |
| **Surface** | `#f9f9ff` | `■` | Main card background. |
| **Surface Dim** | `#d0daf0` | `■` | Slightly darker surface variant. |
| **Surface Bright** | `#f9f9ff` | `■` | Higher-intensity surface background. |
| **Surface Container Lowest** | `#ffffff` | `■` | Pure White. Card surfaces and input fields (creates layering over the background). |
| **Surface Container Low** | `#f0f3ff` | `■` | Subdued container surface. |
| **Surface Container** | `#e7eeff` | `■` | Standard container color. |
| **Surface Container High** | `#dee8ff` | `■` | Highlighted container surface. |
| **Surface Container Highest**| `#d9e3f9` | `■` | Deepest surface/container color. |
| **Surface Variant** | `#d9e3f9` | `■` | Decorative elements and layout dividers. |

### Typography & Ink Colors

| Color | HEX | Preview | Description / Purpose |
| :--- | :--- | :--- | :--- |
| **On Background** | `#121c2c` | `■` | Charcoal/Black. Primary text color. |
| **On Surface** | `#121c2c` | `■` | Charcoal/Black. Text inside standard cards. |
| **On Surface Variant** | `#43474e` | `■` | Secondary body text and metadata. |
| **Outline** | `#74777f` | `■` | Component borders and dividers. |
| **Outline Variant** | `#c4c6cf` | `■` | Soft dividers and inactive state borders. |

### Semantic & Feedback Colors

| Color | HEX | Preview | Description / Purpose |
| :--- | :--- | :--- | :--- |
| **Success / Paid** | `#48BB78` | `■` | Specifically for "Lunas" (Paid) status badges and positive balance indicators. |
| **Warning / Unpaid** | `#DD6B20` | `■` | Specifically for "Belum Bayar" (Unpaid) status badges. |
| **Error / Alert** | `#ba1a1a` | `■` | Urgent alerts, error messages, and emergency triggers. |
| **Error Container** | `#ffdad6` | `■` | Alert card backgrounds. |
| **On Error Container** | `#93000a` | `■` | Alert text inside containers. |

---

## Typography

This design system utilizes **Inter** exclusively to ensure maximum readability across various screen sizes and age groups.

| Typography Key | Font Family | Size | Weight | Line Height | Letter Spacing | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | Inter | `48px` | `700` (Bold) | `56px` | `-0.02em` | Hero titles / Main page headers |
| `headline-md` | Inter | `24px` | `600` (SemiBold) | `32px` | `-0.01em` | Section headers |
| `title-lg` | Inter | `20px` | `600` (SemiBold) | `28px` | Default | Cards / Dialog titles |
| `emergency-label` | Inter | `18px` | `700` (Bold) | `24px` | Default | High-priority alert buttons/banners |
| `body-md` | Inter | `16px` | `400` (Regular) | `24px` | Default | Main body copy, readable descriptions |
| `body-sm` | Inter | `14px` | `400` (Regular) | `20px` | Default | Secondary details, descriptive captions |
| `label-md` | Inter | `12px` | `600` (SemiBold) | `16px` | `0.05em` | Form labels, table headers, small caps |

> [!NOTE]
> Financial figures and key transaction numbers should use `medium` or `semibold` weights in data tables for enhanced emphasis.

---

## Spacing & Grid System

Spacing is based on a **4px baseline rhythm** to govern consistent alignment and margins.

| Size | Value | Description |
| :--- | :--- | :--- |
| `base` | `4px` | Fine-grain margins / padding |
| `xs` | `8px` | Internal element spacing |
| `sm` | `12px` | Card/input internal padding |
| `md` | `16px` | Standard spacing / Mobile margins |
| `lg` | `24px` | Section gap / Vertical card margin |
| `xl` | `32px` | Large section breaks / Desktop margins |
| `gutter` | `16px` | Grid column spacing |
| `container-max`| `1200px` | Maximum content layout width |

- **Layout Structure**: 12-column fluid grid for desktop; 4-column structure for mobile viewports.
- **Rhythm**: Margin of `md` (16px) on mobile and `xl` (32px) on desktop.

---

## Shapes & Radii

A friendly, modern shape language is achieved by using generous corner rounding to soften financial details.

| Size | Radius | Description |
| :--- | :--- | :--- |
| `sm` | `0.25rem (4px)` | Small status tags and badges |
| `DEFAULT` | `0.5rem (8px)` | Smaller inputs or components |
| `md` | `0.75rem (12px)` | Standard containers, cards, and primary buttons |
| `lg` | `1rem (16px)` | Hero sections, main dashboard containers |
| `xl` | `1.5rem (24px)` | Large modal sheets / layouts |
| `full` | `9999px` | Pill-shaped status chips and circular icons |

---

## Components

### 1. Buttons
- **Primary Action**: Solid `#1A365D` with white text. Employs a `12px` (`md`) corner radius.
- **Emergency Button**: Fixed, sticky button placed at the bottom right. Solid `#E53E3E` background with a high-contrast white icon and text. Built larger for accessibility (minimum height `56px`).

### 2. Cards
- **Structure**: Pure white background (`#FFFFFF`), `12px` corner radius, with a very soft ambient shadow:
  `0px 4px 12px rgba(26, 54, 93, 0.05)`
- **Purpose**: Ideal for summary metrics (e.g., "Current Balance"), transaction logs, and resident profiles.
- **Interactive State**: Hover shifts the card slightly upward (`-2px`) and intensifies the shadow to `0px 8px 24px rgba(26, 54, 93, 0.12)`.

### 3. Status Chips
- **Lunas (Paid)**: Light green background (`#C6F6D5`) with dark green text (`#22543D`). Uses a full pill shape (`rounded-full`).
- **Belum Bayar (Unpaid)**: Light orange background (`#FEEBC8`) with dark orange text (`#7B341E`). Uses a full pill shape (`rounded-full`).

### 4. Input Fields
- **Style**: Outlined style with a `12px` corner radius.
- **Active / Focus State**: Transitions to a `2px` border in deep forest teal (`#004D40`).

### 5. Data Tables
- **Header**: Light gray header row background (`#F1F5F9`) using uppercase `label-md` typography.
- **Rows**: Clean, borderless table rows separated by thin dividers (`#EDF2F7`).
- **Responsive**: Supports horizontal scrolling on mobile viewports with a sticky first column for resident names or identifiers.
