---
layout: post
title: Operating Systems Final Review
date: '2017-12-06 18:30:00 -0400'
published: true
---
# Chapters 8 - Onwards
---
## Memory Management (Chapter 8 and 9)

#### Memory Allocation -

#### Internal and External Fragmentation
Refers to available memory rather than the size of files
* Internal fragmentation: allocated memory may be slightly larger than the requested memory and not being used
  * For example, consider an OS that can only allocate blocks of size 5KB. If a process requires 29KB of memory, the smallest allocation the OS can make that will satisfy this need is 30KB
  * This means there is 1KB of internal fragmentation after the memory is allocated. "Room for Growth"
* External fragmentation: total memory space exists to satisfy the request, but it is not contiguous
  * Consider contiguous blocks of 50KB, 30KB, 10KB, and 100KB. The 50KB blocks and 100KB blocks are free space
  * A process requires 125KB of free space to run. There is enough space between the two free blocks, but they are not immediately contiguous
  * External fragmentation can be reduced by using compaction:
    * Shuffle memory contents to place all free memory together in one large block
    * Compaction is only possible if relocation is dynamic and is done at execution time

#### Segmentation and Paging
**Segmentation**:  
Memory-management scheme which organizes a program into a collection of segments, which are contiguous regions of virtual memory
* Each process has a segment table in hardware. Each entry is a segment
* A segment can be located anywhere in physical memory
  * Each segment has a(n): start address, length, and access permission (R/W/RW)
* Processes can share segments
  * Same start address, length, same/different access permissions
* A logical address consists of a two-tuple:  
```
<segment-number, offset>  
```  
* Segment table - maps two-dimensional physical addresses; each table entry has:
  * base - contains the starting physical address where the segments reside in memory
  * limit - specifies the length of the segment
* Because segments vary in length, memory allocation is a dynamic storage-allocation problem
* For example, consider the following table:  
| Base | Bound | Access Permissions |
| :--- | :--- | :--- |
| 1000 | 200 | R |
| 4000 | 1521 | RW |
| 9000 | 400 | RW |  
If we have the following requests from a program:
1. Read (seg 0, offset 150) = legal read of segment 0 at address 1150 (Base = 1000 + offset (150))
  * Offset is less than bound (200), so this is within the segment
2. Write (seg 1, offset 51) = legal read of segment 1 at address 4051 (Base = 4000 + offset (51))
3. Write (seg 2, offset 20) = legal write of segment 2 at address 9020 (Base = 9000 + offset (20))
4. Read (seg 2, offset 501) = illegal read of segment 2 at address 9501 (Base = 9000 + offset 501)
  * Results in a segmentation fault, offset is more than bound
5. Write (seg 0, offset 10) = illegal write of segment 0 at address 1010 (Base = 1000 + offset 10)
  * Results in an illegal write exception. Address is within the segment, but the permissions are only read for this segment
**Paging**:  
* Divide physical memory into fixed-sized blocks called frames
  * Avoids external fragmentation
  * Avoids problem of varying sized memory chunks
* Divides logical memory into blocks of the same size called Pages
* To run a program of size N pages, we need to find N free frames and load the program
* We set up a page table to translate logical to physical addresses
* For additional virtual memory notes, see [notes on virtual memory]({{ tbarc.github.io }}/_posts/2017-11-11-virtual-memory.markdown)

#### Kernel Memory Allocation: Buddy system, Slab
**Buddy System**
* Allocates memory from fixed-size segments consisting of physically-contiguous pages
* Memory allocated using power-of-2 allocator
  * Satisfies requests in units sized as power of 2
  * Request rounded up to the next highest power of 2
  * When smaller allocation is needed than is available, the current chunk splits into buddies of next-lower power of 2
    * Continue this process until appropriately sized chunk is available
* For example, assume 256KB chunk available, kernel requests 21KB
  * Split into A1 and A2 of 128KB each
    * One further divided into B1 and B2 of 64KB
      * One further into C1 and C2 of 32 KB each, one is used to satisfy the request
* Advantage - quickly coalesce unused chunks into a larger chunk
* Disadvantage - fragmentation
**Slab Allocator**  
* A slab is one or more physically contiguous pages
* Cache consists of one or more slabs
* Single cache for each unique kernel data structure
  * Each cache filled with objects - instantiations of the data structure
* 
