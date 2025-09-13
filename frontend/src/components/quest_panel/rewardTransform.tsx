import type {Stats} from "../../types.tsx";

export const rewardTransform = (data: Stats) => {
    const transformed_data = [];
    const keys: string[] = Object.keys(data);
    const values = Object.values(data);
    for (let i = 0; i < keys.length; i++) {
        if (values[i] != 0)
            transformed_data.push({type: keys[i], value: values[i]});
    }
    return transformed_data;
}