/**
 * The StatusResult is returned for calls to `git.status()`, represents the state of the
 * working directory.
 */
export interface StatusResult {
    not_added: string[];
    conflicted: string[];
    created: string[];
    deleted: string[];
    modified: string[];
    renamed: StatusResultRenamed[];
    staged: string[];
    files: FileStatusResult[];
    ahead: number;
    behind: number;
    current: string | null;
    tracking: string | null;
 
    /**
     * Gets whether this represents a clean working branch.
     */
    isClean(): boolean;
 }


export interface FileStatusResult {

    /** Original location of the file, when the file has been moved */
    from?: string
 
    /** Path of the file */
    path: string;
 
    /** First digit of the status code of the file, e.g. 'M' = modified.
     Represents the status of the index if no merge conflicts, otherwise represents
     status of one side of the merge. */
    index: string;
 
    /** Second digit of the status code of the file. Represents status of the working directory
     if no merge conflicts, otherwise represents status of other side of a merge. */
    working_dir: string;
 }

 /**
 * Represents file name changes in a StatusResult
 */
export interface StatusResultRenamed {
    from: string;
    to: string;
 }