import { prisma } from "@/lib/prisma";
import Gig from "@/components/gigs/Gig";

/**
 * Retrieves an artist object by its ID.
 * @param {string} id - The ID of the artist to retrieve.
 * @returns {Artist | undefined} The artist object matching the provided ID, or undefined if not found.
 */
async function getArtistById(id: string) {
    const artist = await prisma.artist.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            upcomingGigs: {
                where: {
                    date: {
                        gte: new Date()
                    }
                },
                include: {
                    venue: {select: {name: true}},
                    lineup: {select: {id: true, name: true}}
                },
                orderBy: {
                    date: 'asc'
                }
            }
        }
    })
    return artist;
}

export default async function ArtistDetailPage({ params }: { params: { id: string } }) {
    const artist = await getArtistById(params.id)

    let artistContent = (
        <div key={artist?.id}>
            <div className="bg-slate-400 dark:bg-slate-800 p-6">
                <h1 className="font-bold text-xl mb-4">Artist Details</h1>
                <h1>{artist?.name}</h1>
                <h2>{artist?.genre?.join(", ")}</h2>
                <a href={artist?.url? artist?.url : "#"} className={artist?.url? "text-blue-500" : "text-yellow-500"}>{artist?.url? artist?.url : "No URL listed"}</a>
                <h2 className="font-thin font-sans">{artist?.bio}</h2>

                
            </div>
            
            <div className="p-6">
                <h1 className="font-bold text-xl mb-4">Upcoming Gigs 🎤</h1>
                {artist?.upcomingGigs?.length === 0 || !artist?.upcomingGigs && <p className="text-yellow-500">No upcoming gigs 🥱 </p>}
                {artist?.upcomingGigs?.map((gig) => (
                    <Gig key={gig.id} {...gig}/>
                ))}
            </div>
        </div>
    )

    return (
        <>
            {artistContent}
        </>
        
    )
}

