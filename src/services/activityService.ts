import { supabase } from '../lib/supabase';

export interface ActivityPayload {
  userId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  title: string;
  description?: string;
  visibility?: 'public' | 'private' | 'team';
  metadata?: any;
}

export class ActivityService {
  static async create(payload: ActivityPayload): Promise<void> {
    try {
      const { error } = await supabase.rpc('create_activity', {
        p_user_id: payload.userId,
        p_actor_id: payload.actorId,
        p_action: payload.action,
        p_entity_type: payload.entityType,
        p_entity_id: payload.entityId,
        p_title: payload.title,
        p_description: payload.description || null,
        p_visibility: payload.visibility || 'private',
        p_metadata: payload.metadata || {},
      });

      if (error) {
        console.error('Failed to create activity:', error);
      }
    } catch (err) {
      console.error('Activity service error:', err);
    }
  }

  static async logProjectCreated(
    corporateId: string,
    projectId: string,
    projectTitle: string
  ): Promise<void> {
    await this.create({
      userId: corporateId,
      actorId: corporateId,
      action: 'created',
      entityType: 'project',
      entityId: projectId,
      title: 'Created new project',
      description: `Created project "${projectTitle}"`,
      visibility: 'private',
    });
  }

  static async logApplicationSubmitted(
    volunteerId: string,
    projectId: string,
    projectTitle: string
  ): Promise<void> {
    await this.create({
      userId: volunteerId,
      actorId: volunteerId,
      action: 'applied',
      entityType: 'project',
      entityId: projectId,
      title: 'Applied to project',
      description: `Applied to "${projectTitle}"`,
      visibility: 'private',
    });
  }

  static async logApplicationApproved(
    volunteerId: string,
    corporateId: string,
    projectId: string,
    projectTitle: string
  ): Promise<void> {
    await this.create({
      userId: volunteerId,
      actorId: corporateId,
      action: 'approved',
      entityType: 'application',
      entityId: projectId,
      title: 'Application approved',
      description: `Your application to "${projectTitle}" was approved`,
      visibility: 'private',
    });
  }

  static async logHoursLogged(
    volunteerId: string,
    projectId: string,
    hours: number,
    projectTitle: string
  ): Promise<void> {
    await this.create({
      userId: volunteerId,
      actorId: volunteerId,
      action: 'logged_hours',
      entityType: 'volunteer_hours',
      entityId: projectId,
      title: 'Logged volunteer hours',
      description: `Logged ${hours} hours for "${projectTitle}"`,
      visibility: 'private',
    });
  }

  static async logMilestoneCompleted(
    corporateId: string,
    projectId: string,
    milestoneTitle: string,
    projectTitle: string
  ): Promise<void> {
    await this.create({
      userId: corporateId,
      actorId: corporateId,
      action: 'completed',
      entityType: 'milestone',
      entityId: projectId,
      title: 'Milestone completed',
      description: `Completed "${milestoneTitle}" in "${projectTitle}"`,
      visibility: 'team',
    });
  }

  static async logDocumentUploaded(
    ngoId: string,
    documentId: string,
    documentType: string
  ): Promise<void> {
    await this.create({
      userId: ngoId,
      actorId: ngoId,
      action: 'uploaded',
      entityType: 'document',
      entityId: documentId,
      title: 'Document uploaded',
      description: `Uploaded ${documentType} document`,
      visibility: 'private',
    });
  }

  static async logPaymentRequested(
    corporateId: string,
    requesterId: string,
    amount: number,
    projectTitle: string
  ): Promise<void> {
    await this.create({
      userId: corporateId,
      actorId: requesterId,
      action: 'requested',
      entityType: 'payment',
      entityId: requesterId,
      title: 'Payment requested',
      description: `Payment of PKR ${amount.toLocaleString()} requested for "${projectTitle}"`,
      visibility: 'team',
    });
  }

  static async logNGOVerified(
    ngoId: string,
    adminId: string,
    ngoName: string
  ): Promise<void> {
    await this.create({
      userId: ngoId,
      actorId: adminId,
      action: 'verified',
      entityType: 'ngo',
      entityId: ngoId,
      title: 'NGO verified',
      description: `${ngoName} has been verified`,
      visibility: 'public',
    });
  }

  static async logCertificateIssued(
    volunteerId: string,
    issuerId: string,
    certificateId: string,
    projectTitle: string
  ): Promise<void> {
    await this.create({
      userId: volunteerId,
      actorId: issuerId,
      action: 'issued',
      entityType: 'certificate',
      entityId: certificateId,
      title: 'Certificate issued',
      description: `Earned certificate for "${projectTitle}"`,
      visibility: 'public',
    });
  }
}
