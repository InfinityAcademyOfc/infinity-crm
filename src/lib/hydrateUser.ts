
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";
import { Company, CompanyProfile } from "@/types/company";
import { CompanySubscription, Plan } from "@/types/plan";

interface HydrationResult {
  profile: UserProfile | null;
  companyProfile: CompanyProfile | null;
  company: Company | null;
  subscription: CompanySubscription | null;
  plan: Plan | null;
}

export async function hydrateUser(): Promise<HydrationResult> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No authenticated user found");
      return { 
        profile: null, 
        companyProfile: null, 
        company: null, 
        subscription: null,
        plan: null 
      };
    }
    
    console.log("Hydrating user:", user.id);
    const isCompany = user.user_metadata?.is_company === true;
    
    let profile: UserProfile | null = null;
    let companyProfile: CompanyProfile | null = null;
    let company: Company | null = null;
    let subscription: CompanySubscription | null = null;
    let plan: Plan | null = null;
    
    if (isCompany) {
      // Fetch company profile
      console.log("Fetching company profile");
      const { data: companyProfileData, error: companyProfileError } = await supabase
        .from("profiles_companies")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      
      if (companyProfileError) {
        console.error("Error fetching company profile:", companyProfileError);
      } else if (companyProfileData) {
        companyProfile = companyProfileData as CompanyProfile;
        console.log("Company profile loaded:", companyProfile.name);
        
        // If company profile has a company_id, fetch the company
        if (companyProfile.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from("companies")
            .select("*")
            .eq("id", companyProfile.company_id)
            .maybeSingle();
          
          if (companyError) {
            console.error("Error fetching company:", companyError);
          } else if (companyData) {
            company = companyData as Company;
            console.log("Company loaded:", company.name);
            
            // Fetch subscription if company exists
            if (companyProfile.subscription_id) {
              const { data: subscriptionData, error: subscriptionError } = await supabase
                .from("company_subscriptions")
                .select("*")
                .eq("id", companyProfile.subscription_id)
                .maybeSingle();
              
              if (subscriptionError) {
                console.error("Error fetching subscription:", subscriptionError);
              } else if (subscriptionData) {
                subscription = subscriptionData as CompanySubscription;
                console.log("Subscription loaded:", subscription.id);
                
                // Fetch plan if subscription exists
                if (subscription.plan_id) {
                  const { data: planData, error: planError } = await supabase
                    .from("plans")
                    .select("*")
                    .eq("id", subscription.plan_id)
                    .maybeSingle();
                  
                  if (planError) {
                    console.error("Error fetching plan:", planError);
                  } else if (planData) {
                    plan = planData as Plan;
                    console.log("Plan loaded:", plan.name);
                  }
                }
              }
            }
          }
        }
      }
    } else {
      // Fetch user profile
      console.log("Fetching user profile");
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else if (profileData) {
        profile = profileData as UserProfile;
        console.log("User profile loaded:", profile.name);
        
        // If user profile has a company_id, fetch the company
        if (profile.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from("companies")
            .select("*")
            .eq("id", profile.company_id)
            .maybeSingle();
          
          if (companyError) {
            console.error("Error fetching company:", companyError);
          } else if (companyData) {
            company = companyData as Company;
            console.log("Company loaded:", company.name);
            
            // Fetch company subscription
            const { data: subscriptionData, error: subscriptionError } = await supabase
              .from("company_subscriptions")
              .select("*")
              .eq("company_id", company.id)
              .eq("status", "active")
              .maybeSingle();
            
            if (subscriptionError) {
              console.error("Error fetching subscription:", subscriptionError);
            } else if (subscriptionData) {
              subscription = subscriptionData as CompanySubscription;
              console.log("Subscription loaded:", subscription.id);
              
              // Fetch plan
              if (subscription.plan_id) {
                const { data: planData, error: planError } = await supabase
                  .from("plans")
                  .select("*")
                  .eq("id", subscription.plan_id)
                  .maybeSingle();
                
                if (planError) {
                  console.error("Error fetching plan:", planError);
                } else if (planData) {
                  plan = planData as Plan;
                  console.log("Plan loaded:", plan.name);
                }
              }
            }
          }
        }
      }
    }
    
    return { profile, companyProfile, company, subscription, plan };
  } catch (error) {
    console.error("Error hydrating user:", error);
    throw error;
  }
}
