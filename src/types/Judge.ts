export interface TestCase {
    input: string | null | undefined;
    output: string | null | undefined;
}

export interface Result {
    judge: string;
    stdout: string;
    stderr: string;
    used_mem: string;
    runtime: string;
}
