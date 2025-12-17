import { supabase, openai } from '../lib/config';
import movies from '../data/movies.ts';

async function seedDb() {
  try {
    const data = await Promise.all(
      movies.map(async (movie) => {
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: movie.content,
        });
        return {
          title: movie.title,
          release_year: movie.releaseYear,
          content: movie.content,
          embedding: embeddingResponse.data[0].embedding,
        };
      })
    );
    const { error } = await supabase.from('movies').insert(data);
    if (error) throw new Error(`Error inserting data into Supabase: ${error.message}`);

    console.log('embeddings complete and data insert complete');
  } catch (error) {
    console.error(error);
  }
}

seedDb();
