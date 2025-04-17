import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface MenuOption {
    label: string,
    icon: IconDefinition,
    onClick: () => void,
}